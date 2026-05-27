import StackClient from "./StackClient";

export const metadata = {
  title: "Call Stack Visualization | AlgoBuddy",
  description: "Visualize how system stack frames are pushed and popped recursively.",
  keywords: ["Call Stack", "Stack Frames", "Factorial Stack", "Recursion", "DSA"],
};

export default function Page() {
  return <StackClient />;
}
