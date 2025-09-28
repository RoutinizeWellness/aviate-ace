/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as a320AirConditioningComplete from "../a320AirConditioningComplete.js";
import type * as a320AirConditioningQuestionsData from "../a320AirConditioningQuestionsData.js";
import type * as addA320AirConditioningQuestions from "../addA320AirConditioningQuestions.js";
import type * as auth from "../auth.js";
import type * as autumn from "../autumn.js";
import type * as courses from "../courses.js";
import type * as exams from "../exams.js";
import type * as lessons from "../lessons.js";
import type * as questionSuggestions from "../questionSuggestions.js";
import type * as seedA320AirConditioningQuestions from "../seedA320AirConditioningQuestions.js";
import type * as seedA320AutoflightComplete from "../seedA320AutoflightComplete.js";
import type * as seedA320AutoflightDoorsQuestions from "../seedA320AutoflightDoorsQuestions.js";
import type * as seedA320AutoflightQuestions from "../seedA320AutoflightQuestions.js";
import type * as seedB737CompleteQuestions from "../seedB737CompleteQuestions.js";
import type * as seedQuestions from "../seedQuestions.js";
import type * as typeRating from "../typeRating.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  a320AirConditioningComplete: typeof a320AirConditioningComplete;
  a320AirConditioningQuestionsData: typeof a320AirConditioningQuestionsData;
  addA320AirConditioningQuestions: typeof addA320AirConditioningQuestions;
  auth: typeof auth;
  autumn: typeof autumn;
  courses: typeof courses;
  exams: typeof exams;
  lessons: typeof lessons;
  questionSuggestions: typeof questionSuggestions;
  seedA320AirConditioningQuestions: typeof seedA320AirConditioningQuestions;
  seedA320AutoflightComplete: typeof seedA320AutoflightComplete;
  seedA320AutoflightDoorsQuestions: typeof seedA320AutoflightDoorsQuestions;
  seedA320AutoflightQuestions: typeof seedA320AutoflightQuestions;
  seedB737CompleteQuestions: typeof seedB737CompleteQuestions;
  seedQuestions: typeof seedQuestions;
  typeRating: typeof typeRating;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
