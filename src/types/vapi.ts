export interface RootResponse {
  message: MessageData;
}

export interface MessageData {
  timestamp: number;
  type: string;
  toolCalls: ToolCall[];
  toolCallList: ToolCall[];
  toolWithToolCallList: ToolWithToolCall[];
  artifact: Artifact;
  call: CallDetails;
  phoneNumber: PhoneNumber;
  customer: Customer;
  assistant: Assistant;
}

// --- Tool Call Interfaces ---

export interface ToolCall {
  id: string;
  type: string;
  function: ToolCallFunction;
  isPrecededByText?: boolean;
}

export interface ToolCallFunction {
  name: string;
  arguments: arguments; // Handled as both object and stringified JSON in your payload
}
export interface arguments {
  name: string;
  reason: string;
  dateTime: string;
  clinicId: string;
  doctorId: string;
}
export interface ToolWithToolCall {
  type: string;
  function: ToolDefinitionFunction;
  async: boolean;
  server: ServerConfig;
  messages: ToolMessage[];
  variableExtractionPlan: Record<string, any>;
  parameters: KeyValuePair[];
  toolCall: ToolCall;
}

export interface ToolDefinitionFunction {
  name: string;
  strict?: boolean;
  parameters?: Record<string, any>;
  description: string;
}

export interface ServerConfig {
  url: string;
  credentialId: string;
  timeoutSeconds: number;
}

export interface ToolMessage {
  type: string;
  content?: string;
  contents?: any[];
  conditions?: any[];
  blocking: boolean;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

// --- Artifact Interfaces ---

export interface Artifact {
  messages: ArtifactMessage[];
  messagesOpenAIFormatted: OpenAIMessage[];
  variables: CallVariables;
  variableValues: CallVariables;
}

export interface ArtifactMessage {
  role: string;
  message: string;
  time: number;
  secondsFromStart: number;
  endTime?: number;
  duration?: number;
  source?: string;
  metadata?: MessageMetadata;
  toolCalls?: ToolCall[];
  name?: string;
  result?: string;
  toolCallId?: string;
}

export interface MessageMetadata {
  wordLevelConfidence: WordConfidence[];
}

export interface WordConfidence {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
}

export interface OpenAIMessage {
  role: string;
  content?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface CallVariables {
  now: string;
  currentDateTime: string;
  date: string;
  time: string;
  year: string;
  month: string;
  day: string;
  customer: Customer;
  phoneNumber: PhoneNumber;
  transport: Transport;
  call: Omit<
    CallDetails,
    | 'orgId'
    | 'updatedAt'
    | 'cost'
    | 'monitor'
    | 'phoneCallProviderId'
    | 'phoneCallTransport'
    | 'phoneCallProviderDetails'
    | 'sbcCallId'
    | 'assistantId'
    | 'assistantOverrides'
    | 'phoneNumberId'
    | 'customer'
  >;
  cid: string;
  'account-sid': string;
  'forwarded-for': string;
  'application-sid': string;
  'voip-carrier-sid': string;
  'originating-carrier': string;
}

// --- Call & Provider Interfaces ---

export interface CallDetails {
  id: string;
  orgId?: string;
  createdAt: string;
  updatedAt?: string;
  type: string;
  cost?: number;
  monitor?: CallMonitor;
  transport: Transport;
  phoneCallProvider: string;
  phoneCallProviderId?: string;
  phoneCallTransport?: string;
  phoneCallProviderDetails?: PhoneCallProviderDetails;
  sbcCallId?: string;
  status: string;
  assistantId?: string;
  assistantOverrides?: Record<string, any>;
  phoneNumberId?: string;
  customer?: Customer;
}

export interface CallMonitor {
  listenUrl: string;
  controlUrl: string;
}

export interface Transport {
  conversationType: string;
  provider: string;
  callSid: string;
  sbcCallSid: string;
}

export interface PhoneCallProviderDetails {
  sip: SIPDetails;
}

export interface SIPDetails {
  raw: string;
  uri: string;
  body: string;
  method: string;
  headers: Record<string, string>;
  payload: SIPPayload[];
  version: string;
}

export interface SIPPayload {
  type: string;
  content: string;
}

// --- Entity Interfaces ---

export interface PhoneNumber {
  id: string;
  orgId: string;
  assistantId: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  provider: string;
  status: string;
  providerResourceId: string;
}

export interface Customer {
  number: string;
  sipUri: string;
}

// --- Assistant Interfaces ---

export interface Assistant {
  id: string;
  orgId: string;
  name: string;
  voice: VoiceConfig;
  createdAt: string;
  updatedAt: string;
  model: ModelConfig;
  firstMessage: string;
  voicemailMessage: string;
  endCallMessage: string;
  transcriber: TranscriberConfig;
  clientMessages: string[];
  serverMessages: string[];
  endCallPhrases: string[];
  hipaaEnabled: boolean;
  backgroundDenoisingEnabled: boolean;
  startSpeakingPlan: StartSpeakingPlan;
  variableValues: Record<string, string>;
}

export interface VoiceConfig {
  speed: number;
  voiceId: string;
  provider: string;
  fallbackPlan: {
    voices: { voiceId: string; provider: string }[];
  };
}

export interface ModelConfig {
  model: string;
  toolIds: string[];
  messages: { role: string; content: string }[];
  provider: string;
  maxTokens: number;
  temperature: number;
  tools: AssistantTool[];
}

export interface AssistantTool {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  function?: ToolDefinitionFunction;
  messages: ToolMessage[];
  orgId: string;
  async: boolean;
  name?: string;
  url?: string;
  method?: string;
  body?: Record<string, any>;
  variableExtractionPlan: Record<string, any>;
  credentialId?: string;
  parameters?: KeyValuePair[];
  server?: ServerConfig;
  description?: string;
}

export interface TranscriberConfig {
  model: string;
  language: string;
  provider: string;
  fallbackPlan: {
    autoFallback: { enabled: boolean };
    transcribers: { model: string; language: string; provider: string }[];
  };
}

export interface StartSpeakingPlan {
  waitSeconds: number;
  smartEndpointingEnabled: string;
}
