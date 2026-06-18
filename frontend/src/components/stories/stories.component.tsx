import React, { useState, useEffect } from "react";
import StoriesViewComponent, { IStories } from "./stories.view.component";
import { Link } from "react-router-dom";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { getRequestLimit, getWordCount, prompts } from "./stories.utils";
import {
  useGenerateFreeModelMutation,
  useGenerateModelMutation,
} from "../../redux/apis/ai.model.api";
import toast, { Toaster } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { getErrorMessage } from "../../error/error.message";

type Inputs = {
  prompt: string;
};

const StoriesComponent = () => {
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const [stories, setStories] = useState<IStories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [textareaValue, setTextareaValue] = useState<string>("");

  useEffect(() => {
    setValue("prompt", textareaValue);
  }, [textareaValue, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.prompt === "") {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }
    if (getWordCount(data.prompt) < 10) {
      toast.error(
        "Please enter a prompt with at least 10 words to generate a story."
      );
      return;
    }
    setLoading(true);
    try {
      const res = login
        ? await generateModel(data).unwrap()
        : await generateFreeModel(data).unwrap();
      if (res) {
        toast.success(res.message);
        setStories(res.data as IStories[]);
        setSelectedPrompt("");
        setTextareaValue("");
        setValue("prompt", "");
        reset();
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedPrompt(selectedValue);
    setTextareaValue(selectedValue);
  };

  return (
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex justify-between">
          <Link to="/">
            <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded">
              <i className="fa-solid fa-left-long"></i> BACK
            </div>
          </Link>
          {!login && (
            <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 text-gray-400 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded text-sm">
              Free access for 3 requests —{" "}
              <Link to="/login">
                {""}
                <span className="text-indigo-400 underline font-semibold">
                  Login
                </span>{" "}
              </Link>
              {""}
              for more!
            </div>
          )}
          <div className="">
            <button className="mt-1 !rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded">
              <span>
                {" "}
                <span className="text-gray-400 text-xs">Per Month</span>{" "}
                {getRequestLimit(userRole?.subscriptionType as string)}
              </span>
              <Link to="/pricing">
                <span className="border-l border-white/20 pl-2 text-gray-300 cursor-pointer">
                  Upgrade
                </span>
              </Link>
              <i className="fas fa-bolt text-yellow-400"></i>
            </button>
            <div className="mt-3 text-gray-500 text-xs">
              <span>This month request: {data?.requestsThisMonth ?? 0}</span>
              <br />
              <span>Total posts: {data?.postsCount ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="mt-11">
          <h1 className="text-gray-300 text-4xl font-extrabold text-center mb-12 leading-snug drop-shadow-lg tracking-wide">
            ✨ Enter Prompt –{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Generate Story Today!
            </span>{" "}
            ✨
          </h1>

          <div className="max-w-3xl mx-auto p-4">
            <div className="bg-blue-500/10 rounded-md p-4 border border-gray-400">
              <div className="relative">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <textarea
                    {...register("prompt")}
                    className="w-full h-40 resize-none border-none outline-none bg-transparent text-gray-300 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500"
                    placeholder="Every great story begins with a single idea. What’s yours?"
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-lg hover:shadow-indigo-500/50"
                      } transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group cursor-pointer`}
                    >
                      <i className="fas fa-wand-magic-sparkles text-xl transition-transform duration-300 group-hover:animate-wiggle"></i>
                      {loading ? "Generating..." : "Generate"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full max-w-2xl m-auto mt-4">
              <h1 className="text-sm text-gray-500 mb-1">
                Here are some example prompts you can refer to:-
              </h1>
              <div className="relative">
                <select
                  className="w-full p-2 bg-slate-800 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none text-sm"
                  value={selectedPrompt}
                  onChange={handlePromptSelect}
                >
                  <option value="" disabled>
                    Select a prompt
                  </option>
                  {prompts.map((item) => (
                    <option
                      className="text-sm"
                      key={item.id}
                      value={item.prompt}
                    >
                      {item.prompt}
                    </option>
                  ))}
                </select>
                <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none text-gray-300">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StoriesViewComponent
        stories={stories}
        isLogin={login}
        setStories={setStories}
      />
      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesComponent;
