"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Code2,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useUser } from "@/app/contexts/UserContext";
import { useCollaboration } from "@/app/components/ui/useCollaboration";

const SAMPLES = {
  JavaScript: `const numbers = [5, 2, 8, 1];
let minIndex = 0;
if (numbers[1] < numbers[minIndex]) {
  minIndex = 1;
}
swap(numbers, 0, minIndex);
console.log(numbers);`,
  Python: `numbers = [5, 2, 8, 1]
min_index = 0
if numbers[1] < numbers[min_index]:
    min_index = 1
swap(numbers, 0, min_index)
print(numbers)`,
  "C++": `vector<int> numbers = {5, 2, 8, 1};
int minIndex = 0;
if (numbers[1] < numbers[minIndex]) {
  minIndex = 1;
}
swap(numbers[0], numbers[minIndex]);
cout << numbers[0] << " " << numbers[1];`,
  Java: `int[] numbers = {5, 2, 8, 1};
int minIndex = 0;
if (numbers[1] < numbers[minIndex]) {
  minIndex = 1;
}
swap(numbers, 0, minIndex);
System.out.println(numbers);`,
};

const LANGUAGE_HINTS = {
  JavaScript: "Traces assignments, arrays, if branches, swap calls, and console.log output.",
  Python: "Traces lists, assignments, if branches, swap calls, and print output.",
  "C++": "Traces vector declarations, scalar assignments, if branches, swap calls, and cout output.",
  Java: "Traces primitive types, array declarations, if branches, swap calls, and System.out.println output.",
};

const MONACO_LANGUAGE_MAP = {
  JavaScript: "javascript",
  Python: "python",
  "C++": "cpp",
  Java: "java",
};

function cloneVariables(variables) {
  return Object.fromEntries(
    Object.entries(variables).map(([key, value]) => [
      key,
      Array.isArray(value) ? [...value] : value,
    ])
  );
}

function stripLine(line) {
  let clean = line
    .replace(/\/\/.*$/, "")
    .replace(/#.*$/, "")
    .replace(/;+$/, "")
    .trim();

  if (clean === "}") return "";

  if (clean.endsWith("{")) {
    clean = clean.slice(0, -1).trim();
  }

  return clean;
}

function parseArrayLiteral(raw) {
  const match = raw.match(/[\[{]([\d\s,.-]+)[\]}]/);
  if (!match) return null;

  const values = match[1]
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));

  return values.length ? values : null;
}

function resolveValue(token, variables) {
  const clean = token.trim();
  if (/^-?\d+(\.\d+)?$/.test(clean)) return Number(clean);

  const indexMatch = clean.match(/^([A-Za-z_]\w*)\[(.+)\]$/);
  if (indexMatch) {
    const arrayValue = variables[indexMatch[1]];
    const index = resolveValue(indexMatch[2], variables);
    if (Array.isArray(arrayValue) && Number.isInteger(index)) {
      return arrayValue[index];
    }
  }

  if (Object.prototype.hasOwnProperty.call(variables, clean)) {
    return variables[clean];
  }

  return clean.replace(/^["']|["']$/g, "");
}

function evaluateExpression(expression, variables) {
  const expr = expression.trim();
  if (!expr) return "";

  const arrayLiteral = parseArrayLiteral(expr);
  if (arrayLiteral) return arrayLiteral;

  if (/[<>]=?|={2,3}|!=/.test(expr)) {
    const [left, operator, right] = expr.split(/\s*(<=|>=|<|>|={2,3}|!=)\s*/);
    const leftValue = resolveValue(left, variables);
    const rightValue = resolveValue(right, variables);

    if (operator === "<") return leftValue < rightValue;
    if (operator === ">") return leftValue > rightValue;
    if (operator === "<=") return leftValue <= rightValue;
    if (operator === ">=") return leftValue >= rightValue;
    if (operator === "!=") return leftValue !== rightValue;
    return leftValue === rightValue;
  }

  const arithmetic = expr.match(/^(.+)\s*([+\-*/])\s*(.+)$/);
  if (arithmetic) {
    const leftValue = Number(resolveValue(arithmetic[1], variables));
    const rightValue = Number(resolveValue(arithmetic[3], variables));
    if (Number.isFinite(leftValue) && Number.isFinite(rightValue)) {
      if (arithmetic[2] === "+") return leftValue + rightValue;
      if (arithmetic[2] === "-") return leftValue - rightValue;
      if (arithmetic[2] === "*") return leftValue * rightValue;
      if (arithmetic[2] === "/" && rightValue !== 0) return leftValue / rightValue;
    }
  }

  return resolveValue(expr, variables);
}

function formatValue(value) {
  if (Array.isArray(value)) return `[${value.join(", ")}]`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function interpolateOutput(raw, variables) {
  const callBody = raw
    .replace(/^console\.log\(/, "")
    .replace(/^print\(/, "")
    .replace(/^System\.out\.print(?:ln)?\(/, "")
    .replace(/\)$/, "")
    .replace(/^cout\s*<</, "")
    .trim();

  if (!callBody) return "";

  return callBody
    .split(/,|<</)
    .map((part) => formatValue(evaluateExpression(part.trim(), variables)))
    .join(" ")
    .trim();
}

function getFirstArray(variables) {
  return Object.values(variables).find((value) => Array.isArray(value)) || [];
}

function createFrame({ lineNumber, line, variables, consoleOutput, callStack, note }) {
  const arrays = Object.entries(variables).filter(([, value]) => Array.isArray(value));
  const firstArray = arrays[0]?.[1] || [];

  return {
    lineNumber,
    line,
    variables: cloneVariables(variables),
    consoleOutput: [...consoleOutput],
    callStack: [...callStack],
    arrays,
    stack: [...firstArray].reverse(),
    queue: [...firstArray],
    note,
  };
}

function buildTrace(source) {
  const lines = source.split("\n");
  const variables = {};
  const consoleOutput = [];
  const callStack = ["global"];
  const frames = [];

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = stripLine(rawLine);
    if (!line) return;

    let note = "Read this statement.";

    const vectorMatch = line.match(/^(?:[A-Za-z_]\w*\[\]|const|let|var|int|double|float|char|boolean|String|auto|vector<[^>]+>)?\s*([A-Za-z_]\w*)\s*=\s*(.+)$/);
    const arrayUpdateMatch = line.match(/^([A-Za-z_]\w*)\[(.+?)\]\s*=\s*(.+)$/);
    const ifMatch = line.match(/^if\s*\(?(.+?)\)?\s*:?\s*$/);
    const elseIfMatch = line.match(/^(?:else\s+if|elif)\s*\(?(.+?)\)?\s*:?\s*$/);
    const elseMatch = line.match(/^else\s*:?\s*$/);
    const forMatch = line.match(/^for\s*\(?(.+?)\)?\s*:?\s*$/);
    const whileMatch = line.match(/^while\s*\(?(.+?)\)?\s*:?\s*$/);
    const swapMatch = line.match(/^swap\((.+)\)$/);
    const outputMatch = /^(console\.log|print|System\.out\.print(?:ln)?)\(/.test(line) || /^cout\s*<</.test(line);

    if (forMatch) {
      callStack.push("loop");
      note = `Entered a loop header: ${forMatch[1]}. The tracer records the control point without executing untrusted loops.`;
    } else if (whileMatch) {
      callStack.push("loop");
      const result = evaluateExpression(whileMatch[1], variables);
      note = `Entered a while loop header with condition evaluating to ${formatValue(result)}.`;
    } else if (ifMatch) {
      const result = evaluateExpression(ifMatch[1], variables);
      note = `Condition evaluated to ${formatValue(result)}.`;
    } else if (elseIfMatch) {
      const result = evaluateExpression(elseIfMatch[1], variables);
      note = `Else-if condition evaluated to ${formatValue(result)}.`;
    } else if (elseMatch) {
      note = "Entered else branch.";
    } else if (swapMatch) {
      const targets = swapMatch[1].split(",").map((part) => part.trim());
      
      // Try Style B (JS/Python): swap(array, idx1, idx2)
      let arrayName = targets[0];
      let arrayValue = variables[arrayName];
      let leftIndex = targets[1];
      let rightIndex = targets[2];

      // If Style B is not matched (i.e. targets[0] is not a raw array name), try Style A (C++)
      if (!Array.isArray(arrayValue)) {
        arrayName = targets[0]?.match(/^([A-Za-z_]\w*)/)?.[1];
        arrayValue = variables[arrayName];
        leftIndex = targets[0]?.match(/\[(.+)\]/)?.[1];
        rightIndex = targets[1]?.match(/\[(.+)\]/)?.[1];
      }

      if (Array.isArray(arrayValue) && leftIndex !== undefined && rightIndex !== undefined) {
        const a = Number(resolveValue(leftIndex, variables));
        const b = Number(resolveValue(rightIndex, variables));
        if (Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0 && a < arrayValue.length && b < arrayValue.length) {
          [arrayValue[a], arrayValue[b]] = [arrayValue[b], arrayValue[a]];
          note = `Swapped ${arrayName}[${a}] and ${arrayName}[${b}].`;
        } else {
          note = `Tried to swap index ${a} and ${b}, but one of them is invalid or out of bounds.`;
        }
      } else {
        note = "Detected a swap operation and marked it in the execution timeline.";
      }
    } else if (outputMatch) {
      const output = interpolateOutput(line, variables);
      consoleOutput.push(output);
      note = `Console output appended: ${output || "(empty)"}.`;
    } else if (arrayUpdateMatch) {
      const arrayName = arrayUpdateMatch[1];
      const arrayValue = variables[arrayName];
      if (Array.isArray(arrayValue)) {
        const idx = Number(resolveValue(arrayUpdateMatch[2], variables));
        const val = resolveValue(arrayUpdateMatch[3], variables);
        if (Number.isInteger(idx) && idx >= 0 && idx < arrayValue.length) {
          arrayValue[idx] = val;
          note = `Updated ${arrayName}[${idx}] to ${formatValue(val)}.`;
        } else {
          note = `Tried to update index ${idx} of array ${arrayName}, but it is out of bounds.`;
        }
      } else {
        note = `Tried to perform an array update on ${arrayName}, but it is not an array.`;
      }
    } else if (vectorMatch) {
      const [, name, expression] = vectorMatch;
      const value = evaluateExpression(expression, variables);
      variables[name] = value;
      note = `Updated ${name} to ${formatValue(value)}.`;
    }

    frames.push(
      createFrame({
        lineNumber,
        line: rawLine,
        variables,
        consoleOutput,
        callStack,
        note,
      })
    );

    if (forMatch || whileMatch) callStack.pop();
  });

  return frames.length
    ? frames
    : [
        createFrame({
          lineNumber: 1,
          line: "",
          variables,
          consoleOutput,
          callStack,
          note: "Paste code to generate a dry-run timeline.",
        }),
      ];
}

function DataPreview({ title, values, variant = "array" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <div className="mt-3 flex min-h-12 flex-wrap items-center gap-2">
        {values.length ? (
          values.map((value, index) => (
            <div
              key={`${title}-${index}-${value}`}
              className={`flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-semibold ${
                variant === "stack"
                  ? "rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
                  : variant === "queue"
                    ? "rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
                    : "rounded-md bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200"
              } border-current/20`}
            >
              {formatValue(value)}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No values yet</p>
        )}
      </div>
    </div>
  );
}

export default function DryRunClient() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const { user } = useUser();
  const [language, setLanguage] = useState("JavaScript");
  const [source, setSource] = useState(SAMPLES.JavaScript);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [sessionTitle, setSessionTitle] = useState("Dry-run study room");
  const [sessionVisibility, setSessionVisibility] = useState("public");
  const [sessionPassword, setSessionPassword] = useState("");
  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [annotationDraft, setAnnotationDraft] = useState("");
  const [sessionJoinUrl, setSessionJoinUrl] = useState("");
  const [followPresenter, setFollowPresenter] = useState(true);
  const [sessionActionLoading, setSessionActionLoading] = useState(false);
  const [sessionNotice, setSessionNotice] = useState("");
  const [importNotice, setImportNotice] = useState("");

  const suppressBroadcastRef = useRef(false);
  const sendStateRef = useRef(null);
  const fileInputRef = useRef(null);

  const displayName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "Anonymous";

  function handleRemoteStateDelta(delta) {
    const isPresenter =
      collaboration.presenterId && collaboration.presenterId === collaboration.clientId;

    if (!followPresenter && !isPresenter) {
      return;
    }

    suppressBroadcastRef.current = true;

    if (typeof delta.source === "string") {
      setSource(delta.source);
    }
    if (typeof delta.language === "string") {
      setLanguage(delta.language);
    }
    if (typeof delta.step === "number") {
      setStep(delta.step);
    }
    if (typeof delta.playing === "boolean") {
      setPlaying(delta.playing);
    }
    if (typeof delta.speed === "number") {
      setSpeed(delta.speed);
    }

    window.setTimeout(() => {
      suppressBroadcastRef.current = false;
    }, 0);
  }

  const collaboration = useCollaboration({
    displayName,
    onRemoteStateDelta: handleRemoteStateDelta,
  });

  const trace = useMemo(() => buildTrace(source), [source]);
  const current = trace[Math.min(step, trace.length - 1)];
  const sourceLines = source.split("\n");
  const monacoLanguage = useMemo(
    () => MONACO_LANGUAGE_MAP[language] || "javascript",
    [language]
  );

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [source, language]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => {
        if (value >= trace.length - 1) {
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [playing, speed, trace.length]);

  useEffect(() => {
    sendStateRef.current = collaboration.sendEnvelope;
  }, [collaboration.sendEnvelope]);

  useEffect(() => {
    if (!collaboration.session) return;
    if (suppressBroadcastRef.current) {
      suppressBroadcastRef.current = false;
      return;
    }

    if (collaboration.presenterId && collaboration.presenterId !== collaboration.clientId) {
      return;
    }

    sendStateRef.current?.({
      source,
      language,
      step,
      playing,
      speed,
      currentFrameId: `${language}:${step}`,
    });
  }, [
    source,
    language,
    step,
    playing,
    speed,
    collaboration.session,
    collaboration.presenterId,
    collaboration.clientId,
  ]);

  const updateLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setSource(SAMPLES[nextLanguage]);
  };

  const handleCreateSession = async () => {
    setSessionActionLoading(true);
    setSessionNotice("");
    setImportNotice("");
    try {
      const data = await collaboration.createSession({
        title: sessionTitle,
        visibility: sessionVisibility,
        password: sessionVisibility === "private" ? sessionPassword : undefined,
        module: "dry-run",
        createdBy: displayName,
      });
      setSessionJoinUrl(data.joinUrl);
      setSessionNotice(`Created ${data.session.visibility} session ${data.session.joinCode}.`);
    } catch (error) {
      setSessionNotice(error.message || "Failed to create session.");
    } finally {
      setSessionActionLoading(false);
    }
  };

  const handleJoinSession = async () => {
    setSessionActionLoading(true);
    setSessionNotice("");
    setImportNotice("");
    try {
      const data = await collaboration.joinSession({
        sessionCode: sessionCodeInput,
        password: joinPassword,
        createdBy: displayName,
      });
      setSessionJoinUrl(`/visualizer/dry-run?session=${data.session.id}`);
      setSessionNotice(`Joined session ${data.session.joinCode}.`);
    } catch (error) {
      setSessionNotice(error.message || "Failed to join session.");
    } finally {
      setSessionActionLoading(false);
    }
  };

  const handleLeaveSession = async () => {
    await collaboration.leaveSession();
    setSessionJoinUrl("");
    setSessionNotice("Left the collaboration session.");
    setAnnotationDraft("");
  };

  const handleAddAnnotation = () => {
    const annotation = collaboration.addAnnotation({
      timeIndex: step,
      text: annotationDraft,
    });

    if (annotation) {
      setAnnotationDraft("");
      setSessionNotice(`Added annotation at step ${step + 1}.`);
    }
  };

  const handleExportRecording = () => {
    const traceJson = collaboration.exportRecording();
    const blob = new Blob([traceJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `algobuddy-session-${new Date().toISOString().slice(0, 19).replaceAll(":", "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setSessionNotice("Exported session trace.");
  };

  const handleImportRecording = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const snapshot = collaboration.importRecording(text, {
        source: SAMPLES.JavaScript,
        language: "JavaScript",
        step: 0,
        playing: false,
        speed: 900,
      });

      setSource(snapshot.source || SAMPLES.JavaScript);
      setLanguage(snapshot.language || "JavaScript");
      setStep(snapshot.step || 0);
      setPlaying(Boolean(snapshot.playing));
      setSpeed(snapshot.speed || 900);
      setImportNotice(`Imported ${file.name}.`);
      setSessionNotice("Replayed the imported trace locally.");
    } catch (error) {
      setImportNotice(error.message || "Failed to import session trace.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/visualizer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Visualizer
        </Link>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
          {Object.keys(SAMPLES).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => updateLanguage(item)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                language === item
                  ? "bg-violet-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
          Custom code dry run
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Trace code line by line before you run it
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Paste a short algorithm snippet and inspect the execution timeline, variables, console output,
          and data-structure snapshots. The tracer is intentionally static and safe: it explains control
          flow without executing arbitrary user code.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-violet-600" />
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Code editor</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{LANGUAGE_HINTS[language]}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSource(SAMPLES[language])}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reset sample
            </button>
          </div>
          <div className="overflow-hidden rounded-b-xl">
            <Editor
              height="420px"
              language={monacoLanguage}
              theme={isDarkMode ? "vs-dark" : "light"}
              value={source}
              onChange={(value) => setSource(value || "")}
              loading={
                <div className="flex h-[420px] items-center justify-center bg-slate-950 font-mono text-sm text-slate-400">
                  Loading Editor...
                </div>
              }
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                lineHeight: 22,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "all",
              }}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Execution controls</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Step {Math.min(step + 1, trace.length)} of {trace.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                  className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                  disabled={step === 0}
                  aria-label="Previous step"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPlaying((value) => !value)}
                  className="rounded-lg bg-violet-600 p-2 text-white transition hover:bg-violet-700"
                  aria-label={playing ? "Pause dry run" : "Play dry run"}
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setStep((value) => Math.min(trace.length - 1, value + 1))}
                  className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                  disabled={step >= trace.length - 1}
                  aria-label="Next step"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <SlidersHorizontal className="h-4 w-4" />
              Speed
              <input
                type="range"
                min="250"
                max="1400"
                step="50"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="w-full accent-violet-600"
              />
            </label>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Collaboration</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {collaboration.connectionStatus === "connected"
                    ? "Live session connected"
                    : collaboration.connectionStatus === "connecting"
                      ? "Connecting to session"
                      : "Create or join a shared dry-run session"}
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                Presenter: {collaboration.presenterId ? (collaboration.presenterId === collaboration.clientId ? "You" : "Remote") : "Open"}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Session title
                <input
                  value={sessionTitle}
                  onChange={(event) => setSessionTitle(event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Visibility
                <select
                  value={sessionVisibility}
                  onChange={(event) => setSessionVisibility(event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </label>
              {sessionVisibility === "private" ? (
                <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200 sm:col-span-2">
                  Session password
                  <input
                    type="password"
                    value={sessionPassword}
                    onChange={(event) => setSessionPassword(event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
                  />
                </label>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreateSession}
                disabled={sessionActionLoading}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                Create session
              </button>
              <button
                type="button"
                onClick={handleLeaveSession}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-200"
              >
                Leave
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Join code or link
                <input
                  value={sessionCodeInput}
                  onChange={(event) => setSessionCodeInput(event.target.value)}
                  placeholder="Paste a session code or /?session= link"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
                <input
                  type="password"
                  value={joinPassword}
                  onChange={(event) => setJoinPassword(event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleJoinSession}
                disabled={sessionActionLoading}
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Join session
              </button>
              <button
                type="button"
                onClick={() => setFollowPresenter((value) => !value)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  followPresenter
                    ? "border-violet-400 text-violet-700 dark:border-violet-400 dark:text-violet-200"
                    : "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {followPresenter ? "Following presenter" : "Manual control"}
              </button>
            </div>

            {sessionJoinUrl ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                <p className="font-semibold text-slate-900 dark:text-white">Share link</p>
                <p className="mt-1 break-all text-slate-600 dark:text-slate-300">{sessionJoinUrl}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(window.location.origin + sessionJoinUrl)}
                  className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Copy full URL
                </button>
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Participants</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {collaboration.participants.length ? (
                    collaboration.participants.map((participant) => (
                      <span
                        key={participant.id}
                        className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-200"
                      >
                        {participant.displayName || participant.id.slice(0, 6)}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">No one else has joined yet.</span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Annotations</p>
                <div className="mt-2 max-h-28 space-y-2 overflow-auto text-sm text-slate-600 dark:text-slate-300">
                  {collaboration.annotations.length ? (
                    collaboration.annotations.slice(-4).map((item) => (
                      <div key={item.id} className="rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-900/80">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{item.author}</span>
                          <span>Step {Number(item.timeIndex) + 1}</span>
                        </div>
                        <p className="mt-1">{item.text}</p>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">No annotations yet.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Annotation
                <input
                  value={annotationDraft}
                  onChange={(event) => setAnnotationDraft(event.target.value)}
                  placeholder="Add a note for this frame"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <button
                type="button"
                onClick={handleAddAnnotation}
                className="self-end rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-200"
              >
                Add note
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => collaboration.requestControl()}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-200"
              >
                Request control
              </button>
              <button
                type="button"
                onClick={() => collaboration.grantControl()}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-200"
              >
                Handoff to me
              </button>
              <button
                type="button"
                onClick={collaboration.recording ? collaboration.stopRecording : collaboration.startRecording}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                  collaboration.recording ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {collaboration.recording ? "Stop recording" : "Start recording"}
              </button>
              <button
                type="button"
                onClick={handleExportRecording}
                disabled={!collaboration.recordedEvents.length}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:text-slate-200"
              >
                Import JSON
              </button>
              <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportRecording} />
            </div>

            <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              {sessionNotice ? <p>{sessionNotice}</p> : null}
              {importNotice ? <p>{importNotice}</p> : null}
              <p>
                Events recorded: {collaboration.recordedEvents.length} · Session mode:{" "}
                {collaboration.session ? collaboration.session.visibility : "none"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="font-semibold text-slate-900 dark:text-white">Active line</h2>
            <div className="mt-3 max-h-64 overflow-auto rounded-lg bg-slate-950 p-3 font-mono text-sm text-slate-200">
              {sourceLines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className={`grid grid-cols-[2.5rem_1fr] gap-3 rounded px-2 py-1 ${
                    current.lineNumber === index + 1 ? "bg-violet-500/30 text-white" : ""
                  }`}
                >
                  <span className="select-none text-right text-slate-500">{index + 1}</span>
                  <span>{line || " "}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-violet-50 p-3 text-sm font-medium text-violet-900 dark:bg-violet-950 dark:text-violet-100">
              {current.note}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <DataPreview title="Array view" values={getFirstArray(current.variables)} />
        <DataPreview title="Stack view" values={current.stack} variant="stack" />
        <DataPreview title="Queue view" values={current.queue} variant="queue" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="font-semibold text-slate-900 dark:text-white">Variables</h2>
          <div className="mt-3 space-y-2">
            {Object.keys(current.variables).length ? (
              Object.entries(current.variables).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-900"
                >
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{key}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">{formatValue(value)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No variables captured yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Console output</h2>
          </div>
          <div className="mt-3 min-h-28 rounded-lg bg-slate-950 p-3 font-mono text-sm text-emerald-200">
            {current.consoleOutput.length ? (
              current.consoleOutput.map((item, index) => <div key={`${item}-${index}`}>{item}</div>)
            ) : (
              <span className="text-slate-500">No output yet</span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
