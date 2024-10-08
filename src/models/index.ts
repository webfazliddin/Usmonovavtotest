export interface ISelectList {
  orderCode: string;
  text: string;
  value: number;
}

export interface ILanguageList {
  code: string;
  shortName: string;
  fullName: string;
  value: number;
  text: string;
  orderCode: string | null | number;
}

export interface ILanguageSelectList extends ILanguageList {
  img?: string;
}

export interface IMyProgram {
  id: string;
  title: string;
  language?: string;
  languageId?: number;
  price: number;
  iconFileId: string;
  backgroundColorCode?: string;
  completionPercent: number;
  courseCount: number;
  completedCourseCount: number;
  courseTopicCount: number;
  completedCourseTopicCount: number;
  canStart: boolean;
  totalVideosCount: number;
  totalTestsCount: number;
  totalCertificatesCount: number;
  courseTopicChildCount: number;
  durationType: string | number;
  duration: number;
}

export interface ICourses {
  id: string;
  title: string;
  iconFileId: string;
  details: string;
  orderNumber: string;
  courseTypeId: number;
  canStart: boolean;
  courseType: string;
  courseTopicCount: number;
  completedCourseTopicCount: number;
  completionPercent: number;
  courseDuration: number;
}

export interface ITopicsDTO {
  id: string;
  courseTitle: string;
  iconFileId: string;
  topics: ITopics[];
  courseTopics: any[]
}
export interface ITopics {
  courseTopicId: string;
  courseTopic: string;
  orderNumber: string;
  childTopics: IChildTopics[];
}
export interface DefaultShortDataDto {
  id: string;
  orderNumber: number;
  title: string;
}

export interface DefaultLessonDataDto extends DefaultShortDataDto {
  lessonTypeId: number;
  videoThumbnailId: string;
  lessonTestThumbnailId: string;
  title: string;
  lessonType: string;
  watchedDuration: number;
  completionPercentage: number;
  videoDuration: number;
  orderNumber: number;
  isVideoClip: boolean;
  locked: boolean;
  isCompleted?: boolean;
  correctAnswersCount: number;
  testResult: number;
  watchedPercent: number;
  completedQuestionCount: number;
  questionCount: number;
  submissionLimit?: number;
}

export interface TestResult {}

export interface IChildTopics {
  courseTopicId: string;
  courseTopic: string;
  orderNumber: string;
  homeworks: DefaultLessonDataDto[];
  lessonTests: DefaultLessonDataDto[];
  videoLessons: DefaultLessonDataDto[];
}

export interface ILesson {
  courseTopic: string;
  courseTopicId: string;
  courseId: string;
  course: string;
  id: string;
  details: string | null;
  title: string;
  lessonId: string;
  nextVideoLessonId: string;
  watchedDuration: number;
  canRate: boolean;
  videoDuration: number;
  questionCount: number;
  totalDuration: number;
  videoThumbnailId: string;
  videoFiles: IVIdeoFiles[];
  videoTimecodes: ITimeCodes[];
  questions: ILessonQuestionDto[];
  materialFiles: IVideoMaterialFiles[];
  attemptId?: string;
  watchedPeriods: IWatchedPeriods[];
  watchedPercent: number | string;
  submissionLimit: number | null;
  testDuration: number;
}
export interface IVIdeoFiles {
  id: string;
  fileName: string;
}

export interface IWatchedPeriods {
  from: number;
  to: number;
}
export interface IVideoMaterialFiles {
  id: string;
  fileSize?: number;
  fileExtension: string;
  fileName: string;
  message?: string;
  canDownload: boolean;
  documentId?: string;
}
export interface ITimeCodes {
  id: string;
  videoAt: number;
  title: string;
}

export interface ILessonQuestionDto {
  id: string;
  questionText: string;
  questionDuration: number | null;
  lessonTestId: string;
  answers: ILessonQuestionAnswerDto[];
}
export interface ILessonQuestionAnswerDto {
  id: string;
  lessonTestQuestionId: string;
  answerText: string;
}

export interface INewActivity {
  lessonId: string;
  documentId: string;
  lessonTypeId: number;
  segment: string;
}

export interface MYComment {
  documentId: string;
  lessonTypeId: string;
  docOn: string;
  messageText: string;
  repliedMessageId: number | null;
  repliedMessageText: string | null;
  userId: number | null;
  adminId: number | null;
  id: number;
}

export interface MyLessonRating {
  documentId: string;
  lessonTypeId: string;
  ratingId: number;
}
export interface IMyAnswers {
  ownerId: string;
  questionId: string;
  answerId?: string | null;
  duration?: number | null;
  timeGone?: number;
  attemptId: string;
}
export interface GetMyCertificatesDTO {
  certificateFileId: string;
  docOn: string;
  title: string;
  submissionLimit: number;
}

export interface GetMyReferences {
  completingDate: string;
  fullName: string;
  id: string;
  startingDate: string;
  title: string;
  courseId: string;
}

export interface IMyTestResult {
  programTitle: string;
  courses: IMyTestResultCourses[];
}

export interface IMyTestResultCourses {
  courseTitle: string;
  courseTopics: any[]
  lessonTestResults: IMyTestResultCoursesLessonTestResult[];
}

export interface IMyTestResultCoursesLessonTestResult {
  lessonTitle: string;
  questionsCount: number;
  correctAnswersCount: number;
  attemptsCount: number;
  passResult: number;
}
