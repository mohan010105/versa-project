#!/usr/bin/env node

/**
 * Firebase Vercel Deployment Diagnostic Tool
 * 
 * This script helps diagnose Firebase auth/invalid-api-key issues
 * Usage: node verify-firebase-config.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

function divider() {
  log('─'.repeat(70), 'blue');
}

// Check 1: Local .env.local file
function checkLocalEnv() {
  log('\n1️⃣  CHECKING LOCAL ENVIRONMENT FILES', 'blue');
  divider();

  const envPath = path.join(__dirname, '.env.local');
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    success(`.env.local file found`);
    info(`Found ${lines.length} environment variables`);

    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
    ];

    let allFound = true;
    requiredVars.forEach(varName => {
      const regex = new RegExp(`^${varName}=`);
      if (lines.some(line => regex.test(line))) {
        const varLine = lines.find(line => regex.test(line));
        const value = varLine.split('=')[1];
        success(`${varName}: ${maskValue(value)}`);
      } else {
        error(`${varName}: MISSING`);
        allFound = false;
      }
    });

    if (allFound) {
      success('All required Firebase variables found locally');
    } else {
      error('Some required variables are missing from .env.local');
    }
  } else {
    error('.env.local file not found');
    info('Expected location: ' + envPath);
    warning('This file should exist locally. Copy from .env.local.example if needed.');
  }
}

// Check 2: Validate variable format
function checkVariableFormat() {
  log('\n2️⃣  VALIDATING VARIABLE FORMAT', 'blue');
  divider();

  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    warning('Skipping format check (no .env.local file)');
    return;
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));

  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');

    // Check for quotes
    if (value.startsWith('"') || value.startsWith("'")) {
      warning(`${key}: Value is quoted (should remove quotes)`);
      info(`  Current: ${value}`);
      info(`  Correct: ${value.replace(/^["']|["']$/g, '')}`);
    }

    // Check for spaces
    if (value.trim() !== value) {
      warning(`${key}: Value has leading/trailing spaces`);
      info(`  Current: '${value}'`);
      info(`  Correct: '${value.trim()}'`);
    }

    // Validate specific formats
    if (key === 'VITE_FIREBASE_API_KEY') {
      if (!value.startsWith('AIzaSy')) {
        error(`${key}: Should start with 'AIzaSy'`);
      } else if (value.length < 30) {
        error(`${key}: Looks too short (should be 30+ chars)`);
      } else {
        success(`${key}: Format looks correct`);
      }
    }

    if (key === 'VITE_FIREBASE_AUTH_DOMAIN') {
      if (!value.includes('firebaseapp.com')) {
        error(`${key}: Should end with 'firebaseapp.com'`);
      } else {
        success(`${key}: Format looks correct`);
      }
    }

    if (key === 'VITE_FIREBASE_PROJECT_ID') {
      if (!/^[a-z0-9-]+$/.test(value)) {
        error(`${key}: Should only contain lowercase letters, numbers, hyphens`);
      } else {
        success(`${key}: Format looks correct`);
      }
    }
  });
}

// Check 3: FirebaseConfig.js usage
function checkFirebaseConfig() {
  log('\n3️⃣  CHECKING FIREBASE CONFIGURATION CODE', 'blue');
  divider();

  const configPath = path.join(__dirname, 'src/Firebase/FirebaseConfig.js');
  
  if (!fs.existsSync(configPath)) {
    error('FirebaseConfig.js not found');
    return;
  }

  success('FirebaseConfig.js found');
  
  const content = fs.readFileSync(configPath, 'utf-8');
  
  // Check for correct import.meta.env usage
  if (content.includes('import.meta.env.VITE_FIREBASE')) {
    success('✓ Using import.meta.env (correct for Vite)');
  } else if (content.includes('process.env.VITE_FIREBASE')) {
    error('✗ Using process.env (wrong for Vite, should use import.meta.env)');
  }

  // Check for all required variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  requiredVars.forEach(varName => {
    if (content.includes(varName)) {
      success(`${varName}: Referenced in config`);
    } else {
      error(`${varName}: NOT referenced in config`);
    }
  });
}

// Check 4: Vite config
function checkViteConfig() {
  log('\n4️⃣  CHECKING VITE CONFIGURATION', 'blue');
  divider();

  const vitePath = path.join(__dirname, 'vite.config.js');
  
  if (!fs.existsSync(vitePath)) {
    error('vite.config.js not found');
    return;
  }

  success('vite.config.js found');
  
  const content = fs.readFileSync(vitePath, 'utf-8');
  
  // Check if env configuration is explicitly defined
  if (content.includes('define:') && content.includes('process.env')) {
    warning('Custom env define found - ensure VITE_ variables are accessible');
  } else {
    success('Using default Vite env behavior (VITE_ variables automatically exposed)');
  }

  info('Vite automatically exposes variables starting with VITE_ at build time');
}

// Check 5: Package.json build command
function checkPackageJson() {
  log('\n5️⃣  CHECKING BUILD CONFIGURATION', 'blue');
  divider();

  const pkgPath = path.join(__dirname, 'package.json');
  
  if (!fs.existsSync(pkgPath)) {
    error('package.json not found');
    return;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    
    if (pkg.scripts && pkg.scripts.build) {
      success(`Build script found: "${pkg.scripts.build}"`);
      
      if (pkg.scripts.build.includes('vite build')) {
        success('Using Vite build command (correct)');
      }
    } else {
      error('No build script found in package.json');
    }

    // Check for Vite in dependencies
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    if (allDeps.vite) {
      success(`Vite found: v${allDeps.vite}`);
    } else {
      error('Vite not found in dependencies');
    }

    if (allDeps.firebase) {
      success(`Firebase found: v${allDeps.firebase}`);
    } else {
      error('Firebase not found in dependencies');
    }
  } catch (err) {
    error(`Failed to parse package.json: ${err.message}`);
  }
}

// Utility: Mask sensitive values
function maskValue(value) {
  if (!value) return '(empty)';
  if (value.length <= 10) return value;
  return value.substring(0, 5) + '...' + value.substring(value.length - 3);
}

// Main execution
function main() {
  log('\n╔═══════════════════════════════════════════════════════════════════╗', 'blue');
  log('║   Firebase Vercel Deployment - Local Verification Tool            ║', 'blue');
  log('║   Checks: .env.local, vite.config.js, FirebaseConfig.js           ║', 'blue');
  log('╚═══════════════════════════════════════════════════════════════════╝', 'blue');

  checkLocalEnv();
  checkVariableFormat();
  checkFirebaseConfig();
  checkViteConfig();
  checkPackageJson();

  // Summary
  log('\n📋 NEXT STEPS:', 'blue');
  divider();
  info('1. Ensure all variables in .env.local are correct (no quotes, no spaces)');
  info('2. Run: npm run dev');
  info('3. Test login/signup locally');
  info('4. Once working locally, add same variables to Vercel Dashboard:');
  info('   - Settings → Environment Variables');
  info('   - Add each VITE_FIREBASE_* variable');
  info('   - Set environment to "All"');
  info('5. Trigger a redeploy in Vercel');
  info('6. Test on Vercel deployment URL');

  log('\n📚 DOCUMENTATION:', 'blue');
  divider();
  info('See FIREBASE_DEPLOYMENT_FIX.md for complete troubleshooting guide');
  info('See ENV_VARIABLES_SETUP.md for environment variable details');

  log('\n', 'blue');
}

main();
