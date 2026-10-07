import { ImageSourcePropType } from 'react-native';
import storyData from '@/content/story.json';

export type StoryChapter = (typeof storyData.chapters)[number];

export const chapters: StoryChapter[] = storyData.chapters;
export const storyMeta = storyData.meta;
export const storyWordCount = storyData.wordCount;

export const chapterArtwork: Record<string, ImageSourcePropType> = {
  '1': require('../assets/images/scott-cabin.jpg'),
  '3': require('../assets/images/scott-hospital.jpg'),
  '19': require('../assets/images/scott-church.jpg'),
};

export function getChapter(id: string): StoryChapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function getChapterIndex(id: string): number {
  return chapters.findIndex((chapter) => chapter.id === id);
}
