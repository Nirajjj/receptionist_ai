// {
//   message: {
//     timestamp: 1777907426083,
//     type: 'tool-calls',
//     toolCalls: [
//       {
//         id: 'call_iIGzUCVCRTwEperQuqW1NqDB',
//         type: 'function',
//         function: {
//           name: 'bookAppointment2',
//           arguments: {
//             name: 'Niraj',
//             reason: 'I want to fix my braces',
//             dateTime: '2023-10-06T15:00:00',
//             clinicId: '7751ae3d-b277-4d42-9312-a6ce1a8e612a',
//             doctorId: '06a7c83b-89b2-464a-a32c-d08997a957fe'
//           }
//         },
//         isPrecededByText: true
//       }
//     ],
//     toolCallList: [
//       {
//         id: 'call_iIGzUCVCRTwEperQuqW1NqDB',
//         type: 'function',
//         function: {
//           name: 'bookAppointment2',
//           arguments: {
//             name: 'Niraj',
//             reason: 'I want to fix my braces',
//             dateTime: '2023-10-06T15:00:00',
//             clinicId: '7751ae3d-b277-4d42-9312-a6ce1a8e612a',
//             doctorId: '06a7c83b-89b2-464a-a32c-d08997a957fe'
//           }
//         },
//         isPrecededByText: true
//       }
//     ],
//     toolWithToolCallList: [
//       {
//         type: 'function',
//         function: {
//           name: 'bookAppointment2',
//           strict: true,
//           parameters: {
//             type: 'object',
//             required: [ 'name' ],
//             properties: {
//               name: { type: 'string', default: '', description: '' },
//               reason: { type: 'string', default: '', description: '' },
//               dateTime: { type: 'string', default: '', description: '' }
//             }
//           },
//           description: 'Triggered when the user wants to book an appointment.'
//         },
//         async: false,
//         server: {
//           url: 'https://blissful-slightly-these.ngrok-free.dev/api/vapi/appointment',
//           credentialId: '8f2c472e-3889-4e88-a9b3-9918af7d859c',
//           timeoutSeconds: 10
//         },
//         messages: [
//           {
//             type: 'request-start',
//             content: 'Give me just a second while I lock that in for you.',
//             contents: [],
//             conditions: [],
//             blocking: false
//           }
//         ],
//         variableExtractionPlan: { schema: { type: 'object', required: [], properties: {} } },
//         parameters: [
//           {
//             key: 'clinicId',
//             value: '7751ae3d-b277-4d42-9312-a6ce1a8e612a'
//           },
//           {
//             key: 'doctorId',
//             value: '06a7c83b-89b2-464a-a32c-d08997a957fe'
//           }
//         ],
//         toolCall: {
//           id: 'call_iIGzUCVCRTwEperQuqW1NqDB',
//           type: 'function',
//           function: {
//             name: 'bookAppointment2',
//             arguments: {
//               name: 'Niraj',
//               reason: 'I want to fix my braces',
//               dateTime: '2023-10-06T15:00:00',
//               clinicId: '7751ae3d-b277-4d42-9312-a6ce1a8e612a',
//               doctorId: '06a7c83b-89b2-464a-a32c-d08997a957fe'
//             }
//           },
//           isPrecededByText: true
//         }
//       }
//     ],
//     artifact: {
//       messages: [
//         {
//           role: 'system',
//           message: '# Dental Clinic AI Assistant Prompt\n' +
//             '\n' +
//             'Creating new appointments\n' +
//             '\n' +
//             'Cancelling appointments\n' +
//             'al and not lik Keep your answers precise and short. Always sound natural and not like an Al agent.\n',
//           time: 1777907401905,
//           secondsFromStart: 0
//         },
//         {
//           role: 'bot',
//           message: 'Thank you for calling Smile Care Dental Clinic. This is Neha. How may I help you today?',
//           time: 1777907408542,
//           endTime: 1777907409945,
//           secondsFromStart: 6.619,
//           duration: 1403,
//           source: ''
//         },
//         {
//           role: 'user',
//           message: 'I want to book appointment. My name is Niraj and the reason of appointment is I want to fix my braces and appointment should be tomorrow 3 pm.',
//           time: 1777907419223,
//           endTime: 1777907420697,
//           secondsFromStart: 17.3,
//           duration: 1474,
//           metadata: {
//             wordLevelConfidence: [
//               {
//                 word: 'I',
//                 start: 0,
//                 end: 250,
//                 confidence: 1,
//                 punctuated_word: 'I'
//               },
//               {
//                 word: 'want',
//                 start: 250,
//                 end: 500,
//                 confidence: 1,
//                 punctuated_word: 'want'
//               },
//               {
//                 word: 'to',
//                 start: 500,
//                 end: 750,
//                 confidence: 1,
//                 punctuated_word: 'to'
//               },
//               {
//                 word: 'book',
//                 start: 750,
//                 end: 1000,
//                 confidence: 1,
//                 punctuated_word: 'book'
//               },
//               {
//                 word: 'appointment.',
//                 start: 1000,
//                 end: 1250,
//                 confidence: 1,
//                 punctuated_word: 'appointment.'
//               },
//               {
//                 word: 'My',
//                 start: 1250,
//                 end: 1500,
//                 confidence: 1,
//                 punctuated_word: 'My'
//               },
//               {
//                 word: 'name',
//                 start: 1500,
//                 end: 1750,
//                 confidence: 1,
//                 punctuated_word: 'name'
//               },
//               {
//                 word: 'is',
//                 start: 1750,
//                 end: 2000,
//                 confidence: 1,
//                 punctuated_word: 'is'
//               },
//               {
//                 word: 'Niraj',
//                 start: 2000,
//                 end: 2250,
//                 confidence: 1,
//                 punctuated_word: 'Niraj'
//               },
//               {
//                 word: 'and',
//                 start: 2250,
//                 end: 2500,
//                 confidence: 1,
//                 punctuated_word: 'and'
//               },
//               {
//                 word: 'the',
//                 start: 2500,
//                 end: 2750,
//                 confidence: 1,
//                 punctuated_word: 'the'
//               },
//               {
//                 word: 'reason',
//                 start: 2750,
//                 end: 3000,
//                 confidence: 1,
//                 punctuated_word: 'reason'
//               },
//               {
//                 word: 'of',
//                 start: 3000,
//                 end: 3250,
//                 confidence: 1,
//                 punctuated_word: 'of'
//               },
//               {
//                 word: 'appointment',
//                 start: 3250,
//                 end: 3500,
//                 confidence: 1,
//                 punctuated_word: 'appointment'
//               },
//               {
//                 word: 'is',
//                 start: 3500,
//                 end: 3750,
//                 confidence: 1,
//                 punctuated_word: 'is'
//               },
//               {
//                 word: 'I',
//                 start: 3750,
//                 end: 4000,
//                 confidence: 1,
//                 punctuated_word: 'I'
//               },
//               {
//                 word: 'want',
//                 start: 4000,
//                 end: 4250,
//                 confidence: 1,
//                 punctuated_word: 'want'
//               },
//               {
//                 word: 'to',
//                 start: 4250,
//                 end: 4500,
//                 confidence: 1,
//                 punctuated_word: 'to'
//               },
//               {
//                 word: 'fix',
//                 start: 4500,
//                 end: 4750,
//                 confidence: 1,
//                 punctuated_word: 'fix'
//               },
//               {
//                 word: 'my',
//                 start: 4750,
//                 end: 5000,
//                 confidence: 1,
//                 punctuated_word: 'my'
//               },
//               {
//                 word: 'braces',
//                 start: 5000,
//                 end: 5250,
//                 confidence: 1,
//                 punctuated_word: 'braces'
//               },
//               {
//                 word: 'and',
//                 start: 5250,
//                 end: 5500,
//                 confidence: 1,
//                 punctuated_word: 'and'
//               },
//               {
//                 word: 'appointment',
//                 start: 5500,
//                 end: 5750,
//                 confidence: 1,
//                 punctuated_word: 'appointment'
//               },
//               {
//                 word: 'should',
//                 start: 5750,
//                 end: 6000,
//                 confidence: 1,
//                 punctuated_word: 'should'
//               },
//               {
//                 word: 'be',
//                 start: 6000,
//                 end: 6250,
//                 confidence: 1,
//                 punctuated_word: 'be'
//               },
//               {
//                 word: 'tomorrow',
//                 start: 6250,
//                 end: 6500,
//                 confidence: 1,
//                 punctuated_word: 'tomorrow'
//               },
//               {
//                 word: '3',
//                 start: 6500,
//                 end: 6750,
//                 confidence: 1,
//                 punctuated_word: '3'
//               },
//               {
//                 word: 'pm.',
//                 start: 6750,
//                 end: 7000,
//                 confidence: 1,
//                 punctuated_word: 'pm.'
//               }
//             ]
//           }
//         },
//         {
//           toolCalls: [
//             {
//               id: 'call_dvzOKabByVb1hiZyKRsCxsMZ',
//               type: 'function',
//               function: {
//                 name: 'bookAppointment2',
//                 arguments: '{\n' +
//                   '  "name": "Niraj",\n' +
//                   '  "reason": "I want to fix my braces",\n' +
//                   '  "dateTime": "2023-10-06T15:00:00"\n' +
//                   '}'
//               }
//             }
//           ],
//           role: 'tool_calls',
//           message: '',
//           time: 1777907421617,
//           secondsFromStart: 19.694
//         },
//         {
//           role: 'tool_call_result',
//           time: 1777907424995,
//           secondsFromStart: 23.072,
//           name: 'bookAppointment2',
//           result: 'No result returned. If this is unexpected, see troubleshooting tips at https://docs.vapi.ai/tools/custom-tools-troubleshooting#no-result-returned-error',
//           toolCallId: 'call_dvzOKabByVb1hiZyKRsCxsMZ'
//         },
//         {
//           toolCalls: [
//             {
//               id: 'call_iIGzUCVCRTwEperQuqW1NqDB',
//               type: 'function',
//               function: {
//                 name: 'bookAppointment2',
//                 arguments: '{\n' +
//                   '  "name": "Niraj",\n' +
//                   '  "reason": "I want to fix my braces",\n' +
//                   '  "dateTime": "2023-10-06T15:00:00"\n' +
//                   '}'
//               }
//             }
//           ],
//           role: 'tool_calls',
//           message: '',
//           time: 1777907426078,
//           secondsFromStart: 24.155
//         }
//       ],
//       messagesOpenAIFormatted: [
//         {
//           role: 'system',
//           content: '# Dental Clinic AI Assistant Prompt\n' +
//             '\n' +
//             'Creating new appointments\n' +
//             '\n' +
//             'Cancelling appointments\n' +
//             'al and not lik Keep your answers precise and short. Always sound natural and not like an Al agent.\n'
//         },
//         {
//           role: 'assistant',
//           content: 'Thank you for calling Smile Care Dental Clinic. This is Neha. How may I help you today?'
//         },
//         {
//           role: 'user',
//           content: 'I want to book appointment. My name is Niraj and the reason of appointment is I want to fix my braces and appointment should be tomorrow 3 pm.'
//         },
//         {
//           role: 'assistant',
//           tool_calls: [
//             {
//               id: 'call_dvzOKabByVb1hiZyKRsCxsMZ',
//               type: 'function',
//               function: {
//                 name: 'bookAppointment2',
//                 arguments: '{\n' +
//                   '  "name": "Niraj",\n' +
//                   '  "reason": "I want to fix my braces",\n' +
//                   '  "dateTime": "2023-10-06T15:00:00"\n' +
//                   '}'
//               }
//             }
//           ]
//         },
//         {
//           role: 'tool',
//           tool_call_id: 'call_dvzOKabByVb1hiZyKRsCxsMZ',
//           content: 'No result returned. If this is unexpected, see troubleshooting tips at https://docs.vapi.ai/tools/custom-tools-troubleshooting#no-result-returned-error'
//         },
//         {
//           role: 'assistant',
//           tool_calls: [
//             {
//               id: 'call_iIGzUCVCRTwEperQuqW1NqDB',
//               type: 'function',
//               function: {
//                 name: 'bookAppointment2',
//                 arguments: '{\n' +
//                   '  "name": "Niraj",\n' +
//                   '  "reason": "I want to fix my braces",\n' +
//                   '  "dateTime": "2023-10-06T15:00:00"\n' +
//                   '}'
//               }
//             }
//           ]
//         },
//         {
//           role: 'tool',
//           tool_call_id: 'call_iIGzUCVCRTwEperQuqW1NqDB',
//           content: 'Tool Result Still Pending But Proceed Further If Possible.'
//         }
//       ],
//       variables: {
//         now: 'May 4, 2026, 3:10 PM UTC',
//         currentDateTime: 'Monday, May 4, 2026 at 3:10 PM UTC',
//         date: 'May 4, 2026 UTC',
//         time: '3:10 PM UTC',
//         year: '2026',
//         month: 'May',
//         day: '4',
//         customer: {
//           number: '+918850510969',
//           sipUri: 'sip:+918850510969@44.229.228.186:5060'
//         },
//         phoneNumber: {
//           id: '9e6182dd-2e51-46b4-98c8-e04ff485df36',
//           orgId: 'e55185f2-c94c-46ba-a82e-62b65b4c7c8a',
//           assistantId: '974a4b6d-45f9-4567-b016-9b8ed07a5952',
//           number: '+16468131424',
//           createdAt: '2026-05-03T04:55:39.663Z',
//           updatedAt: '2026-05-04T14:16:51.401Z',
//           provider: 'vapi',
//           status: 'active',
//           providerResourceId: '5b813042-4072-4d57-8e2a-72293181eb70'
//         },
//         transport: {
//           conversationType: 'voice',
//           provider: 'vapi.sip',
//           callSid: '523dad09-e416-4ae1-bb1c-303f4a1381bf',
//           sbcCallSid: '893833542-3986896198-1521755631@msc1.382COM.COM'
//         },
//         call: {
//           id: '019df389-f94e-7002-8940-b671d8f4f2de',
//           type: 'inboundPhoneCall',
//           status: 'ringing',
//           createdAt: '2026-05-04T15:09:58.990Z',
//           phoneCallProvider: 'vapi',
//           transport: {
//             conversationType: 'voice',
//             provider: 'vapi.sip',
//             callSid: '523dad09-e416-4ae1-bb1c-303f4a1381bf',
//             sbcCallSid: '893833542-3986896198-1521755631@msc1.382COM.COM'
//           }
//         },
//         cid: '893833542-3986896198-1521755631@msc1.382COM.COM',
//         'account-sid': 'c033b672-5b99-42ae-9ce2-b231e9a522fb',
//         'forwarded-for': '64.125.111.10',
//         'application-sid': '79d078c8-76b2-452a-99e0-ddd5abbf6269',
//         'voip-carrier-sid': 'a5569621-84ac-49cc-a8b8-11c7fb96b905',
//         'originating-carrier': '382com'
//       },
//       variableValues: {
//         now: 'May 4, 2026, 3:10 PM UTC',
//         currentDateTime: 'Monday, May 4, 2026 at 3:10 PM UTC',
//         date: 'May 4, 2026 UTC',
//         time: '3:10 PM UTC',
//         year: '2026',
//         month: 'May',
//         day: '4',
//         customer: {
//           number: '+918850510969',
//           sipUri: 'sip:+918850510969@44.229.228.186:5060'
//         },
//         phoneNumber: {
//           id: '9e6182dd-2e51-46b4-98c8-e04ff485df36',
//           orgId: 'e55185f2-c94c-46ba-a82e-62b65b4c7c8a',
//           assistantId: '974a4b6d-45f9-4567-b016-9b8ed07a5952',
//           number: '+16468131424',
//           createdAt: '2026-05-03T04:55:39.663Z',
//           updatedAt: '2026-05-04T14:16:51.401Z',
//           provider: 'vapi',
//           status: 'active',
//           providerResourceId: '5b813042-4072-4d57-8e2a-72293181eb70'
//         },
//         transport: {
//           conversationType: 'voice',
//           provider: 'vapi.sip',
//           callSid: '523dad09-e416-4ae1-bb1c-303f4a1381bf',
//           sbcCallSid: '893833542-3986896198-1521755631@msc1.382COM.COM'
//         },
//         call: {
//           id: '019df389-f94e-7002-8940-b671d8f4f2de',
//           type: 'inboundPhoneCall',
//           status: 'ringing',
//           createdAt: '2026-05-04T15:09:58.990Z',
//           phoneCallProvider: 'vapi',
//           transport: {
//             conversationType: 'voice',
//             provider: 'vapi.sip',
//             callSid: '523dad09-e416-4ae1-bb1c-303f4a1381bf',
//             sbcCallSid: '893833542-3986896198-1521755631@msc1.382COM.COM'
//           }
//         },
//         cid: '893833542-3986896198-1521755631@msc1.382COM.COM',
//         'account-sid': 'c033b672-5b99-42ae-9ce2-b231e9a522fb',
//         'forwarded-for': '64.125.111.10',
//         'application-sid': '79d078c8-76b2-452a-99e0-ddd5abbf6269',
//         'voip-carrier-sid': 'a5569621-84ac-49cc-a8b8-11c7fb96b905',
//         'originating-carrier': '382com'
//       }
//     },
//     call: {
//       id: '019df389-f94e-7002-8940-b671d8f4f2de',
//       orgId: 'e55185f2-c94c-46ba-a82e-62b65b4c7c8a',
//       createdAt: '2026-05-04T15:09:58.990Z',
//       updatedAt: '2026-05-04T15:09:58.990Z',
//       type: 'inboundPhoneCall',
//       cost: 0,
//       monitor: {
//         listenUrl: 'wss://phone-call-websocket.aws-us-west-2-backend-production1.vapi.ai/019df389-f94e-7002-8940-b671d8f4f2de/listen',
//         controlUrl: 'https://phone-call-websocket.aws-us-west-2-backend-production1.vapi.ai/019df389-f94e-7002-8940-b671d8f4f2de/control'
//       },
//       transport: {
//         conversationType: 'voice',
//         provider: 'vapi.sip',
//         callSid: '523dad09-e416-4ae1-bb1c-303f4a1381bf',
//         sbcCallSid: '893833542-3986896198-1521755631@msc1.382COM.COM'
//       },
//       phoneCallProvider: 'vapi',
//       phoneCallProviderId: '523dad09-e416-4ae1-bb1c-303f4a1381bf',
//       phoneCallTransport: 'sip',
//       phoneCallProviderDetails: {
//         sip: {
//           raw: 'INVITE sip:6468131424@172.30.13.20:5060 SIP/2.0\r\n' +
//             'Via: SIP/2.0/UDP 44.229.228.186;rport=5060;branch=z9hG4bKB4gD5SpFND30H;received=172.31.57.86\r\n' +
//             'Max-Forwards: 70\r\n' +
//             'From: <sip:+918850510969@44.229.228.186:5060>;tag=vggSBaey3eSyr\r\n' +
//             'To: <sip:6468131424@192.168.250.45>\r\n' +
//             'Call-ID: 285fab20-c26e-123f-668a-0ec7040a32ad\r\n' +
//             'CSeq: 114399907 INVITE\r\n' +
//             'Contact: <sip:172.31.57.86:5060>\r\n' +
//             'Accept: application/sdp\r\n' +
//             'Allow: PUBLISH, MESSAGE, UPDATE, PRACK, SUBSCRIBE, REFER, INFO, NOTIFY, REGISTER, OPTIONS, BYE, INVITE, ACK, CANCEL\r\n' +
//             'Supported: 100rel, timer\r\n' +
//             'Min-SE: 600\r\n' +
//             'Privacy: none\r\n' +
//             'Content-Type: application/sdp\r\n' +
//             'Content-Length: 306\r\n' +
//             'X-Account-Sid: c033b672-5b99-42ae-9ce2-b231e9a522fb\r\n' +
//             'X-CID: 893833542-3986896198-1521755631@msc1.382COM.COM\r\n' +
//             'X-Forwarded-For: 64.125.111.10\r\n' +
//             'X-Originating-Carrier: 382com\r\n' +
//             'X-Voip-Carrier-Sid: a5569621-84ac-49cc-a8b8-11c7fb96b905\r\n' +
//             'X-Application-Sid: 79d078c8-76b2-452a-99e0-ddd5abbf6269\r\n' +
//             'Identity: eyJhbGciOiJFUzI1NiIsInBwdCI6InNoYWtlbiIsInR5cCI6InBhc3Nwb3J0IiwieDV1IjoiaHR0cHM6Ly9jci5jY2lkLm5ldXN0YXIuYml6L2NjaWQvYXV0aG4vdjIvY2VydHMvMTExODQuMTExMDQucGVtIn0.eyJhdHRlc3QiOiJDIiwiZGVzdCI6eyJ0biI6WyIxNjQ2ODEzMTQyNCJdfSwiaWF0IjoxNzc3OTA3Mzk4LCJvcmlnIjp7InRuIjoiOTE4ODUwNTEwOTY5In0sIm9yaWdpZCI6IjcwYzc4YTc0LWRhNzQtMTFlYi04ZDE5LTAyNDJhYzEzMDAwMyJ9.SKrKYkMqXqwAjK1e956_57SeGn2DrfstEsAewga-ZUUBlED-4kOtg3k0CtH6TF5qrlLTZS3mNMjbrN-az_bydg;info=<https://cr.ccid.neustar.biz/ccid/authn/v2/certs/11184.11104.pem>;alg=ES256;ppt="shaken"\r\n' +
//             'P-Asserted-Identity: <sip:+918850510969@207.223.78.171:5060>\r\n' +
//             '\r\n' +
//             'v=0\r\n' +
//             'o=msc1 247156 432975 IN IP4 172.30.42.239\r\n' +
//             's=sip call\r\n' +
//             'c=IN IP4 172.30.42.239\r\n' +
//             't=0 0\r\n' +
//             'm=audio 56462 RTP/AVP 0 8 18 101\r\n' +
//             'a=maxptime:20\r\n' +
//             'a=rtpmap:0 PCMU/8000\r\n' +
//             'a=rtpmap:8 PCMA/8000\r\n' +
//             'a=rtpmap:18 G729/8000\r\n' +
//             'a=fmtp:18 annexb=no\r\n' +
//             'a=rtpmap:101 telephone-event/8000\r\n' +
//             'a=fmtp:101 0-15\r\n' +
//             'a=sendrecv\r\n' +
//             'a=rtcp:56463\r\n',
//           uri: 'sip:6468131424@172.30.13.20:5060',
//           body: 'v=0\r\n' +
//             'o=msc1 247156 432975 IN IP4 172.30.42.239\r\n' +
//             's=sip call\r\n' +
//             'c=IN IP4 172.30.42.239\r\n' +
//             't=0 0\r\n' +
//             'm=audio 56462 RTP/AVP 0 8 18 101\r\n' +
//             'a=maxptime:20\r\n' +
//             'a=rtpmap:0 PCMU/8000\r\n' +
//             'a=rtpmap:8 PCMA/8000\r\n' +
//             'a=rtpmap:18 G729/8000\r\n' +
//             'a=fmtp:18 annexb=no\r\n' +
//             'a=rtpmap:101 telephone-event/8000\r\n' +
//             'a=fmtp:101 0-15\r\n' +
//             'a=sendrecv\r\n' +
//             'a=rtcp:56463\r\n',
//           method: 'INVITE',
//           headers: {
//             to: '<sip:+16468131424@192.168.250.45>',
//             via: 'SIP/2.0/UDP 44.229.228.186;rport=5060;branch=z9hG4bKB4gD5SpFND30H;received=172.31.57.86',
//             cseq: '114399907 INVITE',
//             from: '<sip:+918850510969@44.229.228.186:5060>;tag=vggSBaey3eSyr',
//             'X-CID': '893833542-3986896198-1521755631@msc1.382COM.COM',
//             allow: 'PUBLISH, MESSAGE, UPDATE, PRACK, SUBSCRIBE, REFER, INFO, NOTIFY, REGISTER, OPTIONS, BYE, INVITE, ACK, CANCEL',
//             accept: 'application/sdp',
//             'min-se': '600',
//             'call-id': '285fab20-c26e-123f-668a-0ec7040a32ad',
//             contact: '<sip:172.31.57.86:5060>',
//             privacy: 'none',
//             identity: 'eyJhbGciOiJFUzI1NiIsInBwdCI6InNoYWtlbiIsInR5cCI6InBhc3Nwb3J0IiwieDV1IjoiaHR0cHM6Ly9jci5jY2lkLm5ldXN0YXIuYml6L2NjaWQvYXV0aG4vdjIvY2VydHMvMTExODQuMTExMDQucGVtIn0.eyJhdHRlc3QiOiJDIiwiZGVzdCI6eyJ0biI6WyIxNjQ2ODEzMTQyNCJdfSwiaWF0IjoxNzc3OTA3Mzk4LCJvcmlnIjp7InRuIjoiOTE4ODUwNTEwOTY5In0sIm9yaWdpZCI6IjcwYzc4YTc0LWRhNzQtMTFlYi04ZDE5LTAyNDJhYzEzMDAwMyJ9.SKrKYkMqXqwAjK1e956_57SeGn2DrfstEsAewga-ZUUBlED-4kOtg3k0CtH6TF5qrlLTZS3mNMjbrN-az_bydg;info=<https://cr.ccid.neustar.biz/ccid/authn/v2/certs/11184.11104.pem>;alg=ES256;ppt="shaken"',
//             supported: '100rel, timer',
//             'content-type': 'application/sdp',
//             'max-forwards': '70',
//             'X-Account-Sid': 'c033b672-5b99-42ae-9ce2-b231e9a522fb',
//             'content-length': '306',
//             'X-Forwarded-For': '64.125.111.10',
//             'X-Application-Sid': '79d078c8-76b2-452a-99e0-ddd5abbf6269',
//             'X-Voip-Carrier-Sid': 'a5569621-84ac-49cc-a8b8-11c7fb96b905',
//             'p-asserted-identity': '<sip:+918850510969@207.223.78.171:5060>',
//             'X-Originating-Carrier': '382com'
//           },
//           payload: [
//             {
//               type: 'application/sdp',
//               content: 'v=0\r\n' +
//                 'o=msc1 247156 432975 IN IP4 172.30.42.239\r\n' +
//                 's=sip call\r\n' +
//                 'c=IN IP4 172.30.42.239\r\n' +
//                 't=0 0\r\n' +
//                 'm=audio 56462 RTP/AVP 0 8 18 101\r\n' +
//                 'a=maxptime:20\r\n' +
//                 'a=rtpmap:0 PCMU/8000\r\n' +
//                 'a=rtpmap:8 PCMA/8000\r\n' +
//                 'a=rtpmap:18 G729/8000\r\n' +
//                 'a=fmtp:18 annexb=no\r\n' +
//                 'a=rtpmap:101 telephone-event/8000\r\n' +
//                 'a=fmtp:101 0-15\r\n' +
//                 'a=sendrecv\r\n' +
//                 'a=rtcp:56463\r\n'
//             }
//           ],
//           version: '2.0'
//         },
//         sbcCallId: '893833542-3986896198-1521755631@msc1.382COM.COM'
//       },
//       status: 'ringing',
//       assistantId: '974a4b6d-45f9-4567-b016-9b8ed07a5952',
//       assistantOverrides: {
//         variableValues: {
//           cid: '893833542-3986896198-1521755631@msc1.382COM.COM',
//           'account-sid': 'c033b672-5b99-42ae-9ce2-b231e9a522fb',
//           'forwarded-for': '64.125.111.10',
//           'application-sid': '79d078c8-76b2-452a-99e0-ddd5abbf6269',
//           'voip-carrier-sid': 'a5569621-84ac-49cc-a8b8-11c7fb96b905',
//           'originating-carrier': '382com'
//         }
//       },
//       phoneNumberId: '9e6182dd-2e51-46b4-98c8-e04ff485df36',
//       customer: {
//         number: '+918850510969',
//         sipUri: 'sip:+918850510969@44.229.228.186:5060'
//       }
//     },
//     phoneNumber: {
//       id: '9e6182dd-2e51-46b4-98c8-e04ff485df36',
//       orgId: 'e55185f2-c94c-46ba-a82e-62b65b4c7c8a',
//       assistantId: '974a4b6d-45f9-4567-b016-9b8ed07a5952',
//       number: '+16468131424',
//       createdAt: '2026-05-03T04:55:39.663Z',
//       updatedAt: '2026-05-04T14:16:51.401Z',
//       provider: 'vapi',
//       status: 'active',
//       providerResourceId: '5b813042-4072-4d57-8e2a-72293181eb70'
//     },
//     customer: {
//       number: '+918850510969',
//       sipUri: 'sip:+918850510969@44.229.228.186:5060'
//     },
//     assistant: {
//       id: '974a4b6d-45f9-4567-b016-9b8ed07a5952',
//       orgId: 'e55185f2-c94c-46ba-a82e-62b65b4c7c8a',
//       name: 'neha',
//       voice: {
//         speed: 1.2,
//         voiceId: 'en-IN-NeerjaNeural',
//         provider: 'azure',
//         fallbackPlan: {
//           voices: [ { voiceId: 'mr-IN-AarohiNeural', provider: 'azure' } ]
//         }
//       },
//       createdAt: '2026-05-02T15:58:04.964Z',
//       updatedAt: '2026-05-04T14:17:42.050Z',
//       model: {
//         model: 'gpt-4o-mini',
//         toolIds: [
//           'f678b25e-711b-4344-b3ed-fb67037e6e93',
//           '6c9e5c93-fd16-457f-a397-129779b8a1f4'
//         ],
//         messages: [
//           {
//             role: 'system',
//             content: '# Dental Clinic AI Assistant Prompt\n' +
//               '\n' +
//               'Creating new appointments\n' +
//               '\n' +
//               'Cancelling appointments\n' +
//               'al and not lik Keep your answers precise and short. Always sound natural and not like an Al agent.\n'
//           }
//         ],
//         provider: 'openai',
//         maxTokens: 100,
//         temperature: 0.2,
//         tools: [
//           {
//             id: 'f678b25e-711b-4344-b3ed-fb67037e6e93',
//             createdAt: '2026-05-03T10:53:28.762Z',
//             updatedAt: '2026-05-04T12:43:35.537Z',
//             type: 'apiRequest',
//             function: {
//               name: 'api_request_tool',
//               description: 'this api cancel the appoinment'
//             },
//             messages: [ { type: 'request-start', blocking: false } ],
//             orgId: 'e55185f2-c94c-46ba-a82e-62b65b4c7c8a',
//             async: false,
//             name: 'cancelAppoinment',
//             url: 'https://blissful-slightly-these.ngrok-free.dev/api/vapi/appointment',
//             method: 'DELETE',
//             body: {
//               type: 'object',
//               required: [ 'name' ],
//               properties: {
//                 name: {
//                   type: 'string',
//                   default: '',
//                   description: 'this will be the name of the user, which is patient'
//                 }
//               }
//             },
//             variableExtractionPlan: {
//               schema: { type: 'object', required: [], properties: {} }
//             },
//             credentialId: '8f2c472e-3889-4e88-a9b3-9918af7d859c',
//             parameters: [
//               { key: 'phone', value: '{{customer.number}}' },
//               {
//                 key: 'clinicId',
//                 value: '7751ae3d-b277-4d42-9312-a6ce1a8e612a'
//               },
//               {
//                 key: 'doctorId',
//                 value: '06a7c83b-89b2-464a-a32c-d08997a957fe'
//               }
//             ]
//           },
//           {
//             id: '6c9e5c93-fd16-457f-a397-129779b8a1f4',
//             createdAt: '2026-05-04T13:43:43.582Z',
//             updatedAt: '2026-05-04T14:06:09.104Z',
//             type: 'function',
//             function: {
//               name: 'bookAppointment2',
//               strict: true,
//               parameters: {
//                 type: 'object',
//                 required: [ 'name' ],
//                 properties: {
//                   name: { type: 'string', default: '', description: '' },
//                   reason: { type: 'string', default: '', description: '' },
//                   dateTime: { type: 'string', default: '', description: '' }
//                 }
//               },
//               description: 'Triggered when the user wants to book an appointment.'
//             },
//             messages: [
//               {
//                 type: 'request-start',
//                 content: 'Give me just a second while I lock that in for you.',
//                 blocking: false
//               }
//             ],
//             orgId: 'e55185f2-c94c-46ba-a82e-62b65b4c7c8a',
//             server: {
//               url: 'https://blissful-slightly-these.ngrok-free.dev/api/vapi/appointment',
//               credentialId: '8f2c472e-3889-4e88-a9b3-9918af7d859c',
//               timeoutSeconds: 10
//             },
//             async: false,
//             variableExtractionPlan: {
//               schema: { type: 'object', required: [], properties: {} }
//             },
//             parameters: [
//               {
//                 key: 'clinicId',
//                 value: '7751ae3d-b277-4d42-9312-a6ce1a8e612a'
//               },
//               {
//                 key: 'doctorId',
//                 value: '06a7c83b-89b2-464a-a32c-d08997a957fe'
//               }
//             ]
//           }
//         ]
//       },
//       firstMessage: 'Thank you for calling SmileCare Dental Clinic. This is Neha. How may I help you today?',
//       voicemailMessage: "Hello, this is Riley from Wellness Partners. I'm calling about your appointment. Please call us back at your earliest convenience so we can confirm your scheduling details.",
//       endCallMessage: 'Thank you for scheduling with Wellness Partners. Your appointment is confirmed, and we look forward to seeing you soon. Have a wonderful day!',
//       transcriber: {
//         model: 'gemini-2.0-flash',
//         language: 'Multilingual',
//         provider: 'google',
//         fallbackPlan: {
//           autoFallback: { enabled: true },
//           transcribers: [
//             {
//               model: 'gpt-4o-mini-transcribe',
//               language: 'en',
//               provider: 'openai'
//             }
//           ]
//         }
//       },
//       clientMessages: [
//         'conversation-update',
//         'function-call',
//         'hang',
//         'model-output',
//         'speech-update',
//         'status-update',
//         'transfer-update',
//         'transcript',
//         'tool-calls',
//         'user-interrupted',
//         'voice-input',
//         'workflow.node.started',
//         'assistant.started'
//       ],
//       serverMessages: [
//         'conversation-update',
//         'end-of-call-report',
//         'function-call',
//         'hang',
//         'speech-update',
//         'status-update',
//         'tool-calls',
//         'transfer-destination-request',
//         'handoff-destination-request',
//         'user-interrupted',
//         'assistant.started'
//       ],
//       endCallPhrases: [ 'goodbye', 'talk to you soon' ],
//       hipaaEnabled: false,
//       backgroundDenoisingEnabled: true,
//       startSpeakingPlan: { waitSeconds: 0.4, smartEndpointingEnabled: 'livekit' },
//       variableValues: {
//         cid: '893833542-3986896198-1521755631@msc1.382COM.COM',
//         'account-sid': 'c033b672-5b99-42ae-9ce2-b231e9a522fb',
//         'forwarded-for': '64.125.111.10',
//         'application-sid': '79d078c8-76b2-452a-99e0-ddd5abbf6269',
//         'voip-carrier-sid': 'a5569621-84ac-49cc-a8b8-11c7fb96b905',
//         'originating-carrier': '382com'
//       }
//     }
//   }
// }
