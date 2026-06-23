import {
  IStoryInspirationRequest,
  IStoryInspirationResponse,
} from "./story_inspiration.interface";

const cleanIntro = (intro: string): string => intro.trim().replace(/\s+/g, " ");

const previewIntro = (intro: string): string =>
  intro.length > 140 ? `${intro.slice(0, 137).trim()}...` : intro;

const createStoryInspiration = async (
  payload: IStoryInspirationRequest
): Promise<IStoryInspirationResponse> => {
  const intro = previewIntro(cleanIntro(payload.intro));

  return {
    ideas: [
      `Raise the stakes around "${intro}" by giving the main character one urgent choice with a clear cost.`,
      `Turn the opening into a mystery: add one detail that does not belong and let the character investigate it.`,
      `Introduce a rival or ally who knows more about the situation than they are willing to admit.`,
      `Move the next scene to a more pressured setting where the character cannot easily walk away.`,
      `Reveal that the intro is hiding a larger conflict, then end the next scene on a decision or discovery.`,
    ],
  };
};

export const StoryInspirationService = {
  createStoryInspiration,
};
