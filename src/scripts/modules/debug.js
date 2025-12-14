export function logKeyBindings() {
    console.log(`Default Key Bindings
  
Trainer     Function,
  Key       Physical Key
  
┌─────┐      [No Function]
│     │      ┌───┐
│  0  │ ───→ │ 0 │
└─────┘      └───┘
┌─────┐      Reset the CPU
│RESET│      ┌─────┐
│     │ ───→ │ ESC │
└─────┘      └─────┘
┌─────┐      View contents of Accumulator A Register
│ACCA │      ┌───┐
│  1  │ ───→ │ 1 │
└─────┘      └───┘
┌─────┐      View contents of Accumulator B Register
│ACCB │      ┌───┐
│  2  │ ───→ │ 2 │
└─────┘      └───┘
┌─────┐      View contents of Program Counter Register
│ PC  │      ┌───┐
│  3  │ ───→ │ 3 │
└─────┘      └───┘
┌─────┐      View contents of Index Pointer Register
│INDEX│      ┌───┐
│  4  │ ───→ │ 4 │
└─────┘      └───┘
┌─────┐      View contents of Condition Codes Register
│ CC  │      ┌───┐
│  5  │ ───→ │ 5 │
└─────┘      └───┘
┌─────┐      View contents of Stack Pointer Register
│ SP  │      ┌───┐
│  6  │ ───→ │ 6 │
└─────┘      └───┘
┌─────┐      Return from Interrupt
│ RTI │      ┌───┐
│  7  │ ───→ │ 7 │
└─────┘      └───┘
┌─────┐      Single Step
│ SS  │      ┌───┐
│  8  │ ───→ │ 8 │
└─────┘      └───┘
┌─────┐      Break
│ BR  │      ┌───┐
│  9  │ ───→ │ 9 │
└─────┘      └───┘
┌─────┐      Start entering hex at specified address
│AUTO │      ┌───┐
│  A  │ ───→ │ A │
└─────┘      └───┘
┌─────┐      During Examine mode, move address back
│BACK │      ┌───┐
│  B  │ ───→ │ B │
└─────┘      └───┘
┌─────┐      Exam Mode: edit hex at specified address; Else: edit hex in selected register
│CHAN │      ┌───┐
│  C  │ ───→ │ C │
└─────┘      └───┘
┌─────┐      Execute RAM at given address
│ DO  │      ┌───┐
│  D  │ ───→ │ D │
└─────┘      └───┘
┌─────┐      Start viewing hex at specified address
│EXAM │      ┌───┐
│  E  │ ───→ │ E │
└─────┘      └───┘
┌─────┐      During Examine mode, move address forward
│ FWD │      ┌───┐
│  F  │ ───→ │ F │
└─────┘      └───┘`);
}
