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
  '20': require('../assets/images/chapter-20.jpg'),
  '21': require('../assets/images/chapter-21.jpg'),
  '22': require('../assets/images/chapter-22.jpg'),
  '23': require('../assets/images/chapter-23.jpg'),
  '24': require('../assets/images/chapter-24.jpg'),
  '25': require('../assets/images/chapter-25.jpg'),
  '26': require('../assets/images/chapter-26.jpg'),
  '27': require('../assets/images/chapter-27.jpg'),
  '28': require('../assets/images/chapter-28.jpg'),
  '29': require('../assets/images/chapter-29.jpg'),
  '30': require('../assets/images/chapter-30.jpg'),
  '31': require('../assets/images/chapter-31.jpg'),
  '32': require('../assets/images/chapter-32.jpg'),
  '33': require('../assets/images/chapter-33.jpg'),
  '34': require('../assets/images/chapter-34.jpg'),
  '35': require('../assets/images/chapter-35.jpg'),
  '36': require('../assets/images/chapter-36.jpg'),
  '37': require('../assets/images/chapter-37.jpg'),
  '38': require('../assets/images/chapter-38.jpg'),
  '39': require('../assets/images/chapter-39.jpg'),
  '40': require('../assets/images/chapter-40.jpg'),
  '41': require('../assets/images/chapter-41.jpg'),
  '42': require('../assets/images/chapter-42.jpg'),
  '43': require('../assets/images/chapter-43.jpg'),
  '44': require('../assets/images/chapter-44.jpg'),
  '45': require('../assets/images/chapter-45.jpg'),
  '46': require('../assets/images/chapter-46.jpg'),
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
