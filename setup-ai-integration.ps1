# 🤖 AI Integration Setup Script for Ararat Oil Management System
# Run this script in PowerShell to set up AI services integration

Write-Host "🚀 Setting up AI Integration for Ararat Oil Management System..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing AI service dependencies..." -ForegroundColor Yellow

# Install AI service packages
$packages = @(
    "openai",
    "@google-cloud/aiplatform",
    "@azure/openai",
    "aws-sdk",
    "@supabase/supabase-js"
)

foreach ($package in $packages) {
    Write-Host "Installing $package..." -ForegroundColor Cyan
    try {
        npm install $package --save
        Write-Host "✅ $package installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install $package" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📁 Creating AI service directories..." -ForegroundColor Yellow

# Create AI service directories
$aiDirectories = @(
    "src/services/ai",
    "src/components/ai",
    "supabase/functions/ai-expense-categorizer",
    "supabase/functions/ai-sales-forecast",
    "supabase/functions/ai-dashboard-insights",
    "supabase/functions/ai-query-processor"
)

foreach ($dir in $aiDirectories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    } else {
        Write-Host "📁 Directory already exists: $dir" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📝 Creating AI service configuration files..." -ForegroundColor Yellow

# Create AI service configuration
$aiConfigContent = @"
// AI Service Configuration
export const AI_CONFIG = {
  // OpenAI Configuration
  openai: {
    baseURL: 'https://api.openai.com/v1',
    models: {
      gpt4: 'gpt-4-turbo-preview',
      gpt35: 'gpt-3.5-turbo',
      embedding: 'text-embedding-3-small'
    },
    maxTokens: {
      gpt4: 4000,
      gpt35: 2000
    }
  },

  // Google Cloud AI Configuration
  google: {
    vision: 'https://vision.googleapis.com/v1',
    translate: 'https://translation.googleapis.com/v3',
    automl: 'https://automl.googleapis.com/v1'
  },

  // Azure AI Configuration
  azure: {
    cognitiveServices: 'https://api.cognitive.microsoft.com',
    openai: process.env.AZURE_OPENAI_ENDPOINT
  },

  // AWS AI Configuration
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    textract: 'textract',
    forecast: 'forecast',
    comprehend: 'comprehend'
  },

  // Rate limiting configuration
  rateLimits: {
    openai: { calls: 100, period: 'hour' },
    google: { calls: 1000, period: 'day' },
    azure: { calls: 500, period: 'hour' },
    aws: { calls: 200, period: 'hour' }
  },

  // Cache configuration
  cache: {
    ttl: 3600000, // 1 hour in milliseconds
    maxSize: 1000
  }
}

export default AI_CONFIG
"@

$aiConfigContent | Out-File -FilePath "src/services/ai/config.ts" -Encoding UTF8
Write-Host "✅ Created: src/services/ai/config.ts" -ForegroundColor Green

# Create AI Service class
$aiServiceContent = @"
import { createClient } from '@supabase/supabase-js'
import AI_CONFIG from './config'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export interface ExpenseCategorizationData {
  description: string
  amount: number
  vendor?: string
}

export interface SalesForecastParams {
  timeframe: 'daily' | 'weekly' | 'monthly'
  fuelType?: string
  includeSeasonal?: boolean
}

export interface AIInsight {
  type: 'opportunity' | 'warning' | 'trend' | 'recommendation'
  title: string
  description: string
  confidence: number
  actionable: boolean
}

export class AIService {
  
  /**
   * Categorize expense using AI
   */
  static async categorizeExpense(expenseData: ExpenseCategorizationData) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-expense-categorizer', {
        body: expenseData
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('🤖 AI Categorization Error:', error)
      return null
    }
  }

  /**
   * Get sales forecast using AI
   */
  static async getSalesForecast(params: SalesForecastParams) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-sales-forecast', {
        body: params
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('🤖 AI Forecast Error:', error)
      return null
    }
  }

  /**
   * Generate AI insights for dashboard
   */
  static async getDashboardInsights(): Promise<AIInsight[] | null> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-dashboard-insights')
      
      if (error) throw error
      return data?.insights || []
    } catch (error) {
      console.error('🤖 AI Insights Error:', error)
      return null
    }
  }

  /**
   * Process natural language query
   */
  static async processNaturalLanguageQuery(query: string) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-query-processor', {
        body: { query }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('🤖 AI Query Error:', error)
      return null
    }
  }

  /**
   * Get expense categorization suggestions
   */
  static async getExpenseCategories(): Promise<string[]> {
    return [
      'utilities',
      'maintenance', 
      'salaries',
      'supplies',
      'rent',
      'fuel_costs',
      'insurance',
      'marketing',
      'taxes',
      'other'
    ]
  }

  /**
   * Validate AI service health
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-health-check')
      return !error && data?.status === 'healthy'
    } catch (error) {
      console.error('🤖 AI Health Check Error:', error)
      return false
    }
  }
}

export default AIService
"@

$aiServiceContent | Out-File -FilePath "src/services/ai/aiService.ts" -Encoding UTF8
Write-Host "✅ Created: src/services/ai/aiService.ts" -ForegroundColor Green

# Create Edge Function for Expense Categorization
$expenseCategoryFunction = @"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface ExpenseCategorizationRequest {
  description: string
  amount: number
  vendor?: string
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const { description, amount, vendor }: ExpenseCategorizationRequest = await req.json()
    
    if (!description || !amount) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Description and amount are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // OpenAI API call for categorization
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for a fuel station business in Armenia. Categorize expenses into these categories:
            - utilities (electricity, water, gas, internet)
            - maintenance (equipment repair, cleaning, parts)
            - salaries (staff wages, benefits)
            - supplies (office supplies, uniforms, tools)
            - rent (property rent, equipment lease)
            - fuel_costs (wholesale fuel purchases)
            - insurance (business insurance, liability)
            - marketing (advertising, promotions)
            - taxes (business taxes, permits)
            - other (miscellaneous expenses)
            
            Return only a JSON object with: {"category": "category_name", "confidence": 0.95, "subcategory": "specific_type", "tags": ["tag1", "tag2"]}`
          },
          {
            role: 'user',
            content: `Categorize this expense: "${description}", Amount: ${amount} AMD, Vendor: ${vendor || 'Unknown'}`
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const aiResult = await openaiResponse.json()
    
    if (!aiResult.choices || !aiResult.choices[0]) {
      throw new Error('Invalid OpenAI response')
    }

    const categorization = JSON.parse(aiResult.choices[0].message.content)

    return new Response(JSON.stringify({
      success: true,
      data: categorization,
      processed_at: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Expense categorization error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      fallback: {
        category: 'other',
        confidence: 0.5,
        subcategory: 'uncategorized',
        tags: ['manual_review_needed']
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
"@

$expenseCategoryFunction | Out-File -FilePath "supabase/functions/ai-expense-categorizer/index.ts" -Encoding UTF8
Write-Host "✅ Created: supabase/functions/ai-expense-categorizer/index.ts" -ForegroundColor Green

# Create environment variables template
$envTemplate = @"
# AI Service Configuration
# Copy these variables to your .env file and fill in your API keys

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Google Cloud AI Configuration  
GOOGLE_CLOUD_API_KEY=your-google-cloud-api-key-here
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Azure AI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-openai-key-here

# AWS AI Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1

# AI Service Settings
AI_CACHE_TTL=3600
AI_RATE_LIMIT_ENABLED=true
AI_DEBUG_MODE=false
"@

$envTemplate | Out-File -FilePath ".env.ai.example" -Encoding UTF8
Write-Host "✅ Created: .env.ai.example" -ForegroundColor Green

# Create Supabase secrets setup script
$supabaseSecretsScript = @"
# Supabase Secrets Setup for AI Integration
# Run these commands after installing Supabase CLI

Write-Host "Setting up Supabase secrets for AI integration..." -ForegroundColor Yellow

# Check if supabase CLI is available
try {
    supabase --version | Out-Null
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Cyan
    exit 1
}

# Set secrets (replace with your actual keys)
Write-Host "Setting OpenAI API key..." -ForegroundColor Cyan
# supabase secrets set OPENAI_API_KEY=sk-your-actual-key-here

Write-Host "Setting Google Cloud API key..." -ForegroundColor Cyan  
# supabase secrets set GOOGLE_CLOUD_API_KEY=your-actual-key-here

Write-Host "Setting Azure OpenAI configuration..." -ForegroundColor Cyan
# supabase secrets set AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# supabase secrets set AZURE_OPENAI_API_KEY=your-actual-key-here

Write-Host ""
Write-Host "🔐 Remember to replace the example keys with your actual API keys!" -ForegroundColor Yellow
Write-Host "📚 Check the CLOUD-AI-INTEGRATION-GUIDE.md for detailed setup instructions" -ForegroundColor Blue
"@

$supabaseSecretsScript | Out-File -FilePath "setup-supabase-ai-secrets.ps1" -Encoding UTF8
Write-Host "✅ Created: setup-supabase-ai-secrets.ps1" -ForegroundColor Green

# Create AI deployment script
$aiDeployScript = @"
# AI Edge Functions Deployment Script
Write-Host "🚀 Deploying AI Edge Functions..." -ForegroundColor Green

$functions = @(
    "ai-expense-categorizer",
    "ai-sales-forecast", 
    "ai-dashboard-insights",
    "ai-query-processor"
)

foreach ($func in $functions) {
    if (Test-Path "supabase/functions/$func") {
        Write-Host "Deploying $func..." -ForegroundColor Cyan
        try {
            supabase functions deploy $func
            Write-Host "✅ $func deployed successfully" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to deploy $func" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️ Function $func not found, skipping..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 AI Edge Functions deployment complete!" -ForegroundColor Green
"@

$aiDeployScript | Out-File -FilePath "deploy-ai-functions.ps1" -Encoding UTF8
Write-Host "✅ Created: deploy-ai-functions.ps1" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 AI Integration setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Copy .env.ai.example to your .env file and add your API keys" -ForegroundColor Cyan
Write-Host "2. Run setup-supabase-ai-secrets.ps1 to configure Supabase secrets" -ForegroundColor Cyan  
Write-Host "3. Complete the Edge Functions code in supabase/functions/" -ForegroundColor Cyan
Write-Host "4. Run deploy-ai-functions.ps1 to deploy the AI functions" -ForegroundColor Cyan
Write-Host "5. Read CLOUD-AI-INTEGRATION-GUIDE.md for detailed implementation" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation created:" -ForegroundColor Blue
Write-Host "   - CLOUD-AI-INTEGRATION-GUIDE.md (Complete implementation guide)" -ForegroundColor White
Write-Host "   - .env.ai.example (Environment variables template)" -ForegroundColor White
Write-Host "   - setup-supabase-ai-secrets.ps1 (Secrets configuration)" -ForegroundColor White
Write-Host "   - deploy-ai-functions.ps1 (Deployment script)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your Ararat Oil Management System is ready for AI enhancement!" -ForegroundColor Green 