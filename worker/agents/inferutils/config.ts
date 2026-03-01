import { 
    AgentActionKey, 
    AgentConfig, 
    AgentConstraintConfig, 
    AIModels,
    AllModels,
    LiteModels,
    RegularModels,
} from "./config.types";
import { env } from 'cloudflare:workers';
import { getPlatformEnabledProviders } from "../../api/controllers/modelConfig/byokHelper";

// Common configs - these are good defaults
const COMMON_AGENT_CONFIGS = {
    screenshotAnalysis: {
        name: AIModels.CLAUDE_SONNET_4_6,
        reasoning_effort: 'high',
        max_tokens: 12000,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 0.2,
    },
    realtimeCodeFixer: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'medium',
        max_tokens: 6000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.1,
    },
    fastCodeFixer: {
        name: AIModels.CLAUDE_SONNET_4_6,
        reasoning_effort: 'low',
        max_tokens: 2500,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 1,
    },
    templateSelection: {
        name: AIModels.CLAUDE_HAIKU_4_5,
        reasoning_effort: 'low',
        max_tokens: 2000,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 1,
      },
} as const;

const SHARED_IMPLEMENTATION_CONFIG = {
    reasoning_effort: 'medium' as const,
    max_tokens: 48000,
    temperature: 1,
    fallbackModel: AIModels.CLAUDE_SONNET_4_6,
};

//======================================================================================
// ATTENTION! Platform config requires specific API keys and Cloudflare AI Gateway setup.
//======================================================================================
/* 
These are the configs used at build.cloudflare.dev 
You may need to provide API keys for these models in your environment or use 
Cloudflare AI Gateway unified billing for seamless model access without managing multiple keys.
*/
const PLATFORM_AGENT_CONFIG: AgentConfig = {
    ...COMMON_AGENT_CONFIGS,
    blueprint: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'high',
        max_tokens: 20000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.7,
    },
    projectSetup: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'medium',
        max_tokens: 12000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.2,
    },
    phaseGeneration: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'high',
        max_tokens: 16000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.8,
    },
    firstPhaseImplementation: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'high',
        max_tokens: 16000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.15,
    },
    phaseImplementation: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'high',
        max_tokens: 16000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.15,
    },
    conversationalResponse: {
        name: AIModels.CLAUDE_SONNET_4_6,
        reasoning_effort: 'low',
        max_tokens: 1200,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 1,
    },
    deepDebugger: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'high',
        max_tokens: 22000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.1,
    },
    fileRegeneration: {
        name: AIModels.CLAUDE_OPUS_4_6,
        reasoning_effort: 'medium',
        max_tokens: 24000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.1,
    },
    agenticProjectBuilder: {
        name: AIModels.CLAUDE_SONNET_4_6,
        reasoning_effort: 'high',
        max_tokens: 32000,
        fallbackModel: AIModels.CLAUDE_SONNET_4_6,
        temperature: 0.5,
      },
};

//======================================================================================
// Default Gemini-only config (most likely used in your deployment)
//======================================================================================
/* These are the default out-of-the box gemini-only models used when PLATFORM_MODEL_PROVIDERS is not set */
const DEFAULT_AGENT_CONFIG: AgentConfig = {
    ...COMMON_AGENT_CONFIGS,
    templateSelection: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'low',
        max_tokens: 2000,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 1,
    },
    blueprint: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'high',
        max_tokens: 20000,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 0.7,
      },
    projectSetup: {
        name: AIModels.OPENAI_5_MINI,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    phaseGeneration: {
        name: AIModels.OPENAI_5_MINI,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    firstPhaseImplementation: {
        name: AIModels.OPENAI_5_MINI,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    phaseImplementation: {
        name: AIModels.OPENAI_5_MINI,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    conversationalResponse: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'low',
        max_tokens: 1200,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 1,
    },
    deepDebugger: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'high',
        max_tokens: 22000,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 0.1,
    },
    fileRegeneration: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'medium',
        max_tokens: 24000,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 0.1,
      },
    agenticProjectBuilder: {
        name: AIModels.OPENAI_5_MINI,
        reasoning_effort: 'high',
        max_tokens: 32000,
        fallbackModel: AIModels.OPENAI_5_MINI,
        temperature: 0.5,
      },
};

// export const AGENT_CONFIG: AgentConfig = env.PLATFORM_MODEL_PROVIDERS 
//     ? PLATFORM_AGENT_CONFIG 
//     : DEFAULT_AGENT_CONFIG;

const platformEnabledProviders = getPlatformEnabledProviders(env as Env);
const shouldUsePlatformConfig =
    platformEnabledProviders.includes('anthropic') && !!env.CLOUDFLARE_AI_GATEWAY;

export const AGENT_CONFIG: AgentConfig = shouldUsePlatformConfig ? PLATFORM_AGENT_CONFIG : DEFAULT_AGENT_CONFIG;

export const AGENT_CONSTRAINTS: Map<AgentActionKey, AgentConstraintConfig> = new Map([
	['fastCodeFixer', {
		allowedModels: new Set(AllModels),
		enabled: true,
	}],
	['realtimeCodeFixer', {
		allowedModels: new Set(AllModels),
		enabled: true,
	}],
	['fileRegeneration', {
		allowedModels: new Set(AllModels),
		enabled: true,
	}],
	['phaseGeneration', {
		allowedModels: new Set(AllModels),
		enabled: true,
	}],
	['projectSetup', {
        allowedModels: new Set([...RegularModels, AIModels.CLAUDE_SONNET_4_6]),
		enabled: true,
	}],
	['conversationalResponse', {
		allowedModels: new Set(LiteModels),
		enabled: true,
	}],
	['templateSelection', {
		allowedModels: new Set(LiteModels),
		enabled: true,
	}],
]);