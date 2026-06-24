export const downloadTXT = (param1: string, param2?: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  let filename = "story.txt";
  let text = param1;

  if (param2 !== undefined) {
    if (param2.endsWith(".txt") || param2.includes("/") || param2.includes(".")) {
      filename = param2;
      text = param1;
    } else {
      filename = param1.endsWith(".txt") ? param1 : `${param1}.txt`;
      text = param2;
    }
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
