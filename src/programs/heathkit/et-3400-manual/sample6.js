import { hexLoadStringFromAnnotatedCode } from '../../../scripts/modules/util.js';

export const sample6Annotated = `

                                SAMPLE 6
                    THIS IS A TWELVE HOUR CLOCK PROGRAM
                    THE ACCURACY IS DEPENDENT UPON THE MPU CLOCK
                    FREQUENCY AND THE TIMING LOOP AT START.
                    CHANGING THE VALUE AT 0005/6 BY HEX 100
                    CHANGES THE ACCURACY APPROXIMATELY 1 SEC/MIN.
                    HOURS,MINUTE,SECOND RMB 0001/2/3 ARE LOADED
                    WITH THE STARTING TIME. THE FIRST DISPLAY
                    IS ONE SECOND AFTER START OF THE PROGRAM.
                    SECONDS WILL BE CONTENT OF SECOND RMB +1.
                    USES MONITOR SUB ROUTINES REDIS,DSPLAY.
                    NOTE:START THE PROGRAM AT 0004.

0001 00      HOURS   RMB     1        
0002 00      MINUTE  RMB     1        
0003 00      SECOND  RMB     1        
0004 CE B500 START   LDX     #$B500   ADJUST FOR ACCURACY
0007 09      DELAY   DEX              
0008 26 FD           BNE     DELAY    WAIT ONE SECOND
000A C6 60           LDA B   #$60     SIXTY SECONDS,SIXTY MINUTES
000C CD              SEC              ALWAYS INCREMENT SECONDS
000D 8D 0F           BSR     INCS     INCREMENT SECONDS
000F 8D 10           BSR     INMH     INCREMENT MINUTES IF NEEDED
0011 C6 13           LDA B   #$13     TWELVE HOUR CLOCK
0013 8D 0C           BSR     INCMH    INCREMENT HOURS IF NEEDED
0015 BD FCBC         JSR     REDIS    RESET DISPLAY ADDRESS
0018 C6 03           LDA B   #3       NUMBER OF BYTES TO DISPLAY
001A 8D 16           BSR     PRINT    DISPLAY HOURS,MINUTES,SECONDS
001C 20 E6           BRA     START    DO AGAIN
001E CE 0003 INCS    LDX     #SECOND  POINT X AT TIME RMB
0021 A6 00   INCMH   LDA A   0,X      GET CURRENT TIME
0023 89 00           ADC A   #0       INCREMENT IF NECESSARY
0025 19              DAA              FIX TO DECIMAL
0026 11              CBA              TIME TO CLEAR?
0027 25 01          BCS     STORE    NO
0029 4F              CLR A            
002A A7 00   STORE   STA A   90,X     STORE NEW TIME
002C 09              DEX              NEXT TIME RMB
002D 07              TPA              
002E 88 01           EOR A   #1       COMPLEMENT CARRY BIT
0030 06              TAP              
0031 39              RTS              
0032 96 01   PRINT   LDA A   $01      WHAT'S IN HOURS?
0034 26 03           BNE     CONTIN   IF NOT ZERO
0036 7C 0001         INC     HOURS    MAKE HOURS 1
0039 08      CONTIN  INX              POINT X AT HOURS
003A 7E FD7B         JMP     DSPLAY   OUTPUT TO DISPLAYS
`;

export const sample6 = hexLoadStringFromAnnotatedCode(sample6Annotated);
