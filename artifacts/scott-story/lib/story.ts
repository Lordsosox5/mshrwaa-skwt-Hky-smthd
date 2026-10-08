import { ImageSourcePropType } from 'react-native';
import storyData from '@/content/story.json';
import partTwoData from '@/content/story-part-two.json';

export type StoryChapter = (typeof storyData.chapters)[number] & { partId: string };
export type StoryPart = {
  id: string;
  label: string;
  title: string;
  description?: string;
  chapterCount: number;
};

export const storyMeta = storyData.meta;
export const parts: StoryPart[] = [
  {
    id: '1',
    label: 'الجزء الأول',
    title: storyMeta.series,
    chapterCount: storyData.chapters.length,
  },
  {
    ...partTwoData.part,
    chapterCount: partTwoData.chapters.length,
  },
];
export const chapters: StoryChapter[] = [
  ...storyData.chapters.map((chapter) => ({ ...chapter, partId: '1' })),
  ...partTwoData.chapters,
];
export const storyWordCount = storyData.wordCount + partTwoData.wordCount;

export const chapterArtwork: Record<string, ImageSourcePropType> = {
  '0': require('../assets/images/chapter-00.jpg'),
  '1': require('../assets/images/scott-cabin.jpg'),
  '2': require('../assets/images/chapter-02.jpg'),
  '3': require('../assets/images/scott-hospital.jpg'),
  '4': require('../assets/images/chapter-04.jpg'),
  '5': require('../assets/images/chapter-05.jpg'),
  '6': require('../assets/images/chapter-06.jpg'),
  '7': require('../assets/images/chapter-07.jpg'),
  '8': require('../assets/images/chapter-08.jpg'),
  '9': require('../assets/images/chapter-09.jpg'),
  '10': require('../assets/images/chapter-10.jpg'),
  '11': require('../assets/images/chapter-11.jpg'),
  '12': require('../assets/images/chapter-12.jpg'),
  '13': require('../assets/images/chapter-13.jpg'),
  '14': require('../assets/images/chapter-14.jpg'),
  '15': require('../assets/images/chapter-15.jpg'),
  '16': require('../assets/images/chapter-16.jpg'),
  '17': require('../assets/images/chapter-17.jpg'),
  '18': require('../assets/images/chapter-18.jpg'),
  '19': require('../assets/images/scott-church.jpg'),
};

export const partCoverArtwork: Record<string, ImageSourcePropType> = {
  '1': require('../assets/images/cover-smithda.jpg'),
  '2': require('../assets/images/cover-golden-grave.jpg'),
};

export function getChapter(id: string): StoryChapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function getChapterIndex(id: string): number {
  return chapters.findIndex((chapter) => chapter.id === id);
}

export function getPart(id: string): StoryPart | undefined {
  return parts.find((part) => part.id === id);
}
