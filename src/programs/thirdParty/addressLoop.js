import { hexLoadStringFromAnnotatedCode } from '../../../scripts/modules/util.js';

export const addressLoopAnnotated = `

				**      ADDRLP - ADDRESS LOOP
				*
				*		DISPLAYS ALL MEMORY VALUES IN A LOOP
				*       STARTING WITH THE ADDRESS AT #NXTADD

0000 CE FC00   ADDRLP  LDX     RESET,#NXTADD  START WITH THE MONITOR
0003 BD FCF9           JSR     MEM            DISPLAY ADDR AND VALUE
0006 08                INX                    
0007 FF 0001           STX     #NXTADD        STORE NEXT ADDRESS
000A CE A100           LDX                    ADJUST WAIT TIME
000D 09        DELAY   DEX                    
000E 26 FD             BNE     DELAY          TWIDDLE THUMBS
0010 20 EE             BRA     ADDRLP         ON TO THE NEXT ONE

`;

export const addressLoop = hexLoadStringFromAnnotatedCode(addressLoopAnnotated);
