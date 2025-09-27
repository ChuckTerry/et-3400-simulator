import { hexLoadStringFromAnnotatedCode } from '../../../scripts/modules/util.js';

export const sample1Annotated = `

							   SAMPLE 1
				   TRUN ON AND OFF EACH SEGMENT IN
				   SEQUENCE BEGINNING AT H DISPLAY
				   USES MONITOR SUBROUTINES REDIS AND OUTCH
				   NOTE: ONE DP IN EACH DISPLAY IS ACTIVE

0000 BD FCBC START  JSR     REDIS    SET UP FIRST DISPLAY ADDRESS
0003 86 01          LDA A   #$01     FIRST SEGMENT CODE
0005 20 07          BRA     OUT      
0007 D6 F1   SAME   LDA B   DIGADD+1 FIX DISPLAY ADDRESS
0009 CB 10          ADD B   #$10     FOR NEXT SEGMENT
000B D7 F1          STA B   DIGADD+1 
000D 48             ASL A            NEXT SEGMENT CODE
000E BD FE3A OUT    JSR     OUTCH    OUTPUT SEGMENT
0011 CE 2F00        LDX     #$2F00   TIME TO WAIT
0014 09      WAIT   DEX              
0015 26 FD          BNE     WAIT     TIME OUT YET?
0017 16             TAB              
0018 5D             TST B            LAST SEGMENT THIS DISPLAY?
0019 26 EC          BNE     SAME     NEXT SEGMENT
001B 86 01          LDA A   #$01     RESET SEGMENT CODE
001D DE F0          LDX     DIGADD   NEXT DISPLAY
001F 8C C10F        CPX     #$C10F   LAST DISPLAY YET?
0022 26 EA          BNE     OUT      
0024 20 DA          BRA     START    DO AGAIN

`;

export const sample1 = hexLoadStringFromAnnotatedCode(sample1Annotated);
