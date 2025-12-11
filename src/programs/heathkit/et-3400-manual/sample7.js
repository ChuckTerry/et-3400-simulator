import { hexLoadStringFromAnnotatedCode } from '../../../scripts/modules/util.js';

export const sample7Annotated = `

                                SAMPLE 7
                    THIS PROGRAM CALCULATES THE OP CODE VALUE
                    FOR BRANCH INSTRUCTIONS USING THE LAST TWO
                    DIGITS OF THE BRANCH AND DESTINATION ADDRESSES.
                    THE BRANCH ADDRESS IS ENTERED FIRST AND
                    DISPLAYED AT "H" AND "I". THE DESTINATION
                    ADDRESS IS THEN ENTERED AND DISPLAYED AT
                    "N" AND "Z". THE OP CODE IS THEN CALCULATED
                    AND DISPLAYED AT "V" AND "C". THE DISPLAY
                    IS HELD UNTIL NEW INFORMATION IS ENTERED.
                    SINCE ONLY TWO DIGITS ARE ENTERED, IT IS
                    NECESSARY TO MAKE AN ADJUSTMENT IF THE
                    HUNDREDS DIGIT IN THE TWO ADDRESSES IS NOT
                    THE SAME. FOR EXAMPLE TO CALCULATE THE
                    OFFSET OF A BRANCH FROM 00CD TO 01BB.
                    SUBTRACT A NUMBER FROM BOTH ADDRESSES THAT
                    WILL MAKE THE GREATER ADDRESS LESS THAN 100.
                    FOR EASE OF CALCULATION IN THIS CASE,
                    SUBTRACT C0 FROM BOTH ADDRESSES AND ENTER
                    THE RESULTS 0D AND 5B IN THE PROGRAM.
                    SINCE THE DIFFERENCE BETWEEN THE ADDRESSES
                    IS UNCHANGED THE CORRECT OP CODE (4C) WILL
                    BE DISPLAYED. IF THE DISTANCE IS TOO GREAT
                    FOR BRANCHING NO. WILL APPEAR AT "V" AND "C".
                    USES MONITOR SUBROUTINES
                    REDIS IHB OUTBYT OUTSTR

0000 BD FCBC START   JSR     REDIS     FIRST DISPLAY AT "H"
0003 BD FE09         JSR     IHB       INPUT BRANCH ADDRESS
0006 16              TAB               PUT IT IN b
0007 BD FE09         JSR     IHB       INPUT DESTINATION ADDRESS
000A 11              CBA               FORWARD OR BACK?
000B 25 0C           BCS     BACK      IF BACK
000D CB 02   FRWD    ADD B   #$02      ADJUST 2 BYTES
000F 10              SBA               FIND DISTANCE
0010 81 80           CMP A   #$80      IS IT LEGAL?
0012 24 12           BCC     NO        IF NOT
0014 BD FE20 OUT     JSR     OUTBYT    OUTPUT BRANCH OP CODE
0017 20 E7           BRA     START     LOOK FOR NEW ENTRY
0019 40      BACK    NEG A             MAKE A MINUS
001A 1B              ABA               ADD A AND B
001B 8B 02           ADD A   #$02      ADJUST 2 BYTES
001D 43              COM A             GET COMPLIMENT
001E 8B 01           ADD A   #$01      MAKE IT TWO'S
0020 81 80           CMP A   #$80      IS IT LEGAL?
0022 25 02           BCS     NO        IF NOT
0024 20 EE           BRA     OUT       OUTPUT BRANCH OP CODE
0026 BD FE52 NO      JSR     OUTSTR    OUTPUT STRING
0029 15              FCB     $15,$9D   NO.
002A 9D
002B 20 D3           BRA     START     LOOK FOR NEW ENTRY

`;

export const sample7 = hexLoadStringFromAnnotatedCode(sample7Annotated);
