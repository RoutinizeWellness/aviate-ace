#!/usr/bin/env node

/**
 * Script to analyze and clean duplicate questions from the question bank
 * This script can be run independently or as part of the build process
 */

const fs = require('fs');
const path = require('path');

// Simple normalization function (JavaScript version of the TypeScript function)
function normalizeQuestionText(question) {
  return question
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[¿?¡!\.,:;]/g, '')
    .replace(/\b(cuál|cual|what|which|how|cómo|como)\b/g, '')
    .replace(/\(?\s*(variante?|variant)\s*\d+\s*\)?/gi, '')
    .replace(/#\s*\d+/g, '')
    .replace(/\b(a320|airbus\s*a320|boeing\s*737|b737)\b/gi, '')
    .trim();
}

// Analyze question files for duplicates
function analyzeQuestionFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { file: filePath, exists: false, questions: 0, duplicates: [] };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract question texts using regex
    const questionMatches = content.match(/question:\s*["'`](.*?)["'`]/g) || [];
    const questions = questionMatches.map(match => {
      const questionMatch = match.match(/question:\s*["'`](.*?)["'`]/);
      return questionMatch ? questionMatch[1] : null;
    }).filter(Boolean);

    // Find duplicates
    const normalizedQuestions = new Map();
    const duplicates = [];

    questions.forEach((question, index) => {
      const normalized = normalizeQuestionText(question);
      
      if (normalizedQuestions.has(normalized)) {
        const existing = normalizedQuestions.get(normalized);
        duplicates.push({
          normalized,
          questions: [existing.original, question],
          indices: [existing.index, index]
        });
      } else {
        normalizedQuestions.set(normalized, { original: question, index });
      }
    });

    return {
      file: path.basename(filePath),
      exists: true,
      questions: questions.length,
      duplicates: duplicates.length,
      duplicateDetails: duplicates.slice(0, 5) // Show first 5 for brevity
    };
  } catch (error) {
    return {
      file: path.basename(filePath),
      exists: true,
      error: error.message,
      questions: 0,
      duplicates: 0
    };
  }
}

// Main analysis function
function analyzeAllQuestionFiles() {
  const srcDataPath = path.join(__dirname, '..', 'src', 'data');
  
  const questionFiles = [
    path.join(srcDataPath, 'realAviationQuestions.ts'),
    path.join(srcDataPath, 'cleanAviationQuestions.ts'),
    path.join(srcDataPath, 'simpleQuestions.ts'),
    path.join(srcDataPath, 'a320Questions.ts'),
    path.join(srcDataPath, 'questionDatabase.ts'),
    path.join(srcDataPath, 'massiveQuestionSeeding.ts'),
    path.join(srcDataPath, 'practiceQuestions.ts')
  ];

  console.log('🔍 ANALYZING QUESTION BANK FOR DUPLICATES');
  console.log('=' .repeat(60));
  console.log();

  let totalQuestions = 0;
  let totalDuplicates = 0;
  const results = [];

  questionFiles.forEach(filePath => {
    const analysis = analyzeQuestionFile(filePath);
    results.push(analysis);
    
    if (analysis.exists && !analysis.error) {
      totalQuestions += analysis.questions;
      totalDuplicates += analysis.duplicates;
      
      console.log(`📄 ${analysis.file}:`);
      console.log(`   Questions: ${analysis.questions}`);
      console.log(`   Duplicates: ${analysis.duplicates}`);
      
      if (analysis.duplicateDetails && analysis.duplicateDetails.length > 0) {
        console.log('   Sample duplicates:');
        analysis.duplicateDetails.forEach((dup, index) => {
          console.log(`     ${index + 1}. "${dup.questions[0].substring(0, 60)}..."`);
        });
      }
      console.log();
    } else if (analysis.error) {
      console.log(`❌ ${analysis.file}: Error - ${analysis.error}`);
      console.log();
    } else {
      console.log(`⚠️  ${analysis.file}: File not found`);
      console.log();
    }
  });

  console.log('📊 SUMMARY:');
  console.log(`   Total Questions Analyzed: ${totalQuestions}`);
  console.log(`   Total Potential Duplicates: ${totalDuplicates}`);
  console.log(`   Duplicate Rate: ${totalQuestions > 0 ? ((totalDuplicates / totalQuestions) * 100).toFixed(1) : 0}%`);
  console.log();

  if (totalDuplicates > 0) {
    console.log('🚀 NEXT STEPS:');
    console.log('   1. Use the DuplicateQuestionService in your React components');
    console.log('   2. Run the cleanup through the /question-cleanup admin page');
    console.log('   3. Update question data files to use the cleaned questions');
    console.log();
    console.log('💡 TIP: The TypeScript service provides more advanced duplicate detection');
    console.log('   including semantic similarity and question structure analysis.');
  } else {
    console.log('✅ NO DUPLICATES FOUND - Your question bank is clean!');
  }

  console.log('=' .repeat(60));

  return {
    totalQuestions,
    totalDuplicates,
    results,
    duplicateRate: totalQuestions > 0 ? (totalDuplicates / totalQuestions) * 100 : 0
  };
}

// Run the analysis
if (require.main === module) {
  try {
    const analysis = analyzeAllQuestionFiles();
    
    // Write results to a file for later use
    const outputPath = path.join(__dirname, '..', 'duplicate-analysis-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
    
    console.log(`📝 Detailed results saved to: ${path.basename(outputPath)}`);
    
    // Exit with appropriate code
    process.exit(analysis.totalDuplicates > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

module.exports = { analyzeAllQuestionFiles, normalizeQuestionText };