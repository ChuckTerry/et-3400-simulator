import { hexLoadStringFromAnnotatedCode } from '../../../scripts/modules/util.js';

export const sample2Annotated = `

							   SAMPLE 2
				   TURNS ALL DISPLAYS OFF AND ON
				   DISPLAYS HEX VALUE AT 0044
				   USES MONITOR SUBROUTINES REDIS, OUTCH AND OUTHEX

0030 BD FCBC START  JSR     REDIS    FIRST DISPLAY ADDRESS
0033 4F      CLEAR  CLR A
0034 BD FE3A        JSR     OUTCH    TURN ALL SEGMENTS OFF
0037 DE F0          LDX     DIGADD   NEXT DISPLAY
0039 8C C10F        CPX     #$C10F   LAST DISPLAY YET?
003C 26 F5          BNE     CLEAR 
003E 8D 13          BSR     HOLD
0040 BD FCBC        JSR     REDIS    FIRST DISPLAY ADDRESS
0043 86 08          LDA A   #$08     HEX VALUE TO DISPLAY
0045 BD FE28 OUT    JSR     OUTHEX   OUTPUT CHARACTERS      
0048 DE F0          LDX     DIGADD   NEXT DISPLAY  
004A 8C C10F        CPX     #$C10F   LAST DISPLAY YET?      
004D 26 F6          BNE     OUT      
004F 8D 02          BSR     HOLD     
0051 20 DD          BRA     START    DO AGAIN
0053 CE FF00 HOLD   LDX     #$FF00   TIME TO WAIT
0056 09      WAIT   DEX        
0057 26 EA          BNE     WAIT     TIME OUT YET? 
0059 39             RTS     

`;

export const sample2 = hexLoadStringFromAnnotatedCode(sample2Annotated);
