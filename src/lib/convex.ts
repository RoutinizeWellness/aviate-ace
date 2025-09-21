// Convex wrapper with fallback for environments where Convex is not available
import { useMutation as convexUseMutation, useQuery as convexUseQuery } from "convex/react";
import { api as generatedApi } from "../../convex/_generated/api";

const useMutation = convexUseMutation;
const useQuery = convexUseQuery;
const api = generatedApi;

console.log('✅ Convex modules imported successfully');

export { useMutation, useQuery, api };
