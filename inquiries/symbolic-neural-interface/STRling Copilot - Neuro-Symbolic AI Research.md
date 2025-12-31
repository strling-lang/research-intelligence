# **deep-research.md**

## **1\. Introduction: The Neuro-Symbolic Imperative in Pattern Generation**

The synthesis of Neural Network-based generative capabilities with Symbolic Artificial Intelligence represents the defining technical challenge of the current computational era. While Large Language Models (LLMs) have demonstrated unprecedented proficiency in natural language processing, code generation, and heuristic reasoning, they fundamentally operate as probabilistic engines. They predict the next token based on statistical likelihood distributions derived from vast corpora of training data. This stochastic nature, while the source of their creativity and adaptability, renders them inherently unsuitable for tasks requiring absolute syntactic precision, logical consistency, and rigorous safety guarantees.1

Nowhere is this deficiency more acute than in the generation of formal languages, specifically Regular Expressions (regex). Regex is a dense, symbolic notation used ubiquitously in software infrastructure for input validation, data extraction, and security enforcement. It is a domain where a single character deviation does not merely result in a "typo" but can invert the logic of a security filter or introduce algorithmic complexity vulnerabilities known as Regular Expression Denial of Service (ReDoS).3 The "Black Box" problem in this context refers to the opacity of the LLM's generation process: the model produces a string that *looks* correct based on surface-level statistics but lacks an underlying verified structural representation.

This report investigates the feasibility of deploying **STRling**—a modular, object-oriented Domain Specific Language (DSL) and compiler infrastructure—as a "Symbolic Bridge" to span this gap. Unlike raw regex strings, which are opaque sequences of characters, STRling patterns are constructed from defined primitives (Literals, Groups, Quantifiers) governed by a strict Extended Backus-Naur Form (EBNF) grammar.5 By treating the STRling Abstract Syntax Tree (AST) as the ground truth for pattern logic, we propose a Neuro-Symbolic architecture that enforces constraints during generation, verifies intent through bidirectional deconstruction, and guarantees safety via symbolic static analysis.6

The transition to a Neuro-Symbolic paradigm for pattern generation requires moving beyond simple text completion. It demands a system where the "Neural" component (the LLM) acts as a high-level intuition engine, proposing patterns based on natural language descriptions, while the "Symbolic" component (STRling) acts as the rigorous enforcement layer, ensuring that every proposed pattern is syntactically valid, semantically coherent, and mathematically safe before it is ever compiled into an executable regex.1

## **2\. The Representability Gap: Failure Modes of Current Constraints**

To understand the necessity of a GPPL (General Purpose Pattern Language) like STRling, we must first rigorously analyze the limitations of current state-of-the-art constrained decoding techniques. We term this limitation the "Representability Gap": the divergence between the complexity of the target domain (modern regex engines like PCRE2) and the expressiveness of the constraint languages (JSON Schema, GBNF) used to guide LLMs.

### **2.1 The Inadequacy of JSON Schema for Logic**

The industry standard for structured output from LLMs is currently JSON Schema enforcement. Libraries and APIs allow developers to provide a schema definition, ensuring that the model's output parses as valid JSON.8 While this solves the problem of data interoperability, it fails to address the *semantic* validity of the data contained within the structure.

Consider a scenario where an LLM is tasked with generating a regex to validate an email address. A JSON Schema constraint can ensure the output takes the form {"regex": "string"}. However, the constraint engine views the value of "regex" merely as a sequence of valid JSON string characters. It has no visibility into the *logic* encoded within that string.10 The LLM is structurally free to hallucinate a pattern that is syntactically invalid (e.g., unbalanced parentheses (abc) or semantically dangerous (e.g., (a+)+).

This represents a profound Representability Gap: the constraint language (JSON) cannot model the internal grammar of the target value (Regex). The system ensures the container is safe while remaining blind to the potential toxicity of the payload. STRling resolves this by elevating the constraint target from a string literal to a structured DSL. In a STRling-driven system, the "regex" is not a string but a recursive object structure defined by the STRling grammar, forcing the validation logic down into the pattern definition itself.

### **2.2 The Recursive Deficiency in Regular Constraints**

A significant portion of constrained decoding research focuses on restricting LLM sampling to Regular Languages or Finite State Machines (FSMs).11 Tools like outlines and guidance often compile constraints into FSMs to efficiently mask the vocabulary logits during inference.13

However, modern regular expression engines—particularly Perl-Compatible Regular Expressions (PCRE2), which STRling targets 5—are far more expressive than the theoretical definition of "Regular Languages." PCRE2 supports features such as recursive patterns ((?R)), subroutine calls, and backreferences, which push its expressive power into the realm of Context-Sensitive Grammars.15

**The Failure of FSM Constraints:**

1. **Recursion:** An FSM cannot represent recursive structures because it lacks a stack memory mechanism. If an LLM is trying to generate a PCRE2 pattern that matches balanced parentheses (a recursive task), an FSM-based constraint system cannot accurately model the validity of that pattern.17  
2. **Backreferences:** Backreferences (e.g., (a)\\1) require the matching engine to "remember" a previously captured string. This is a context-sensitive feature that cannot be validated by a standard Finite Automaton.18  
3. **Atomic Grouping:** Atomic groups (?\>...) and possessive quantifiers \*+ modify the backtracking behavior of the engine.20 A simple regex constraint cannot enforce the semantic implications of atomicity versus standard greedy matching.

Because current constrained decoding tools often rely on FSMs or simplifications of the target grammar, they cannot fully represent the sophisticated features available in STRling. This forces a trade-off: either restrict the LLM to generating a "dumbed down" subset of regex (losing power) or allow unconstrained generation (losing safety). STRling’s grammar-first approach, supported by a recursive descent parser 5, bypasses these FSM limitations by handling the full complexity of the AST post-generation.

### **2.3 GBNF and the Context-Free Limit**

llama.cpp utilizes GBNF (GGML Backus-Naur Form) to constrain sampling.21 GBNF allows for the definition of Context-Free Grammars (CFGs), which is a significant step up from FSMs. Theoretically, a CFG can represent the syntax of STRling.

However, GBNF has practical limitations regarding **Left Recursion**. Many standard grammar formulations rely on left-recursive rules (e.g., Expression ::= Expression "+" Term). The simple top-down parsers used in many decoding engines often enter infinite loops when encountering left recursion.23 This necessitates a careful restructuring of the STRling grammar to be right-recursive or iterative for compatibility.

Furthermore, GBNF constraints operate strictly on the *surface syntax*. They cannot enforce context-dependent semantic rules, such as "a backreference \\k\<name\> is valid only if a group with name has previously been defined." This creates a secondary Representability Gap where the output is syntactically perfect but semantically broken.25 STRling addresses this via its "Bidirectional Deconstruction" phase, where semantic validation occurs after the initial syntactic generation.

### **2.4 Comparison of Constraint Expressiveness**

The following table summarizes the capabilities of various constraint mechanisms relative to the requirements of generating production-grade PCRE2 patterns via STRling.

| Feature | JSON Schema | FSM / Regex Constraints | GBNF / CFG Constraints | STRling DSL (Target) |
| :---- | :---- | :---- | :---- | :---- |
| **Syntactic Validity** | No (String Content Opaque) | Yes (for Regular Languages) | Yes (for Context-Free Languages) | **Guaranteed** |
| **Recursive Structures** | No | No | Yes (Limited by depth/stack) | **Native Support** |
| **Backreference Logic** | No | No | No (Syntax only, not semantics) | **Verified via AST** |
| **Lookaround Support** | No | Limited | Syntax Only | **Verified via IR** |
| **ReDoS Safety** | None | None | None | **Provable via Analysis** |
| **Constraint Type** | Container | Lexical | Syntactic | **Semantic & Logical** |

The data clearly indicates that while GBNF provides a necessary foundation for syntactic structure, it is insufficient for semantic correctness and safety. The STRling architecture fills this void by providing the logic layer that GBNF lacks.

## **3\. Constrained Decoding: The Symbolic Bridge Implementation**

To operationalize STRling as a Symbolic Bridge, we must integrate its formal grammar into the inference loop of the LLM. This process, known as Constrained Decoding, forces the probabilistic model to navigate the search space of valid tokens defined by the STRling EBNF.

### **3.1 Transpiling STRling EBNF to GBNF**

The primary mechanism for this integration is the translation of STRling's dsl.ebnf 5 into GBNF format compatible with llama.cpp. The STRling grammar is already structured in EBNF, making this translation largely a syntactic transformation.

Grammar Structure Analysis:  
The STRling grammar relies heavily on iteration for sequences and alternation, which is favorable for GBNF conversion as it naturally avoids immediate left-recursion issues found in other formalisms.

* **Sequences:** Concatenation \= { Term } ; maps to concatenation ::= term\* in GBNF.  
* **Alternation:** Alternation \= Concatenation, { "|", Concatenation } ; maps to alternation ::= concatenation ("|" concatenation)\*.

However, specific adaptations are required:

1. **Tokenization Alignment:** LLMs operate on subword tokens. GBNF rules must align with these tokens to avoid "token healing" issues or inefficient masking. STRling literals and keywords (e.g., digit, letter) must be defined as explicit terminal strings in the GBNF.21  
2. **Whitespace Handling:** The STRling grammar defines WHITESPACE.5 In GBNF, we must explicitly insert ws rules between tokens to allow the model to generate readable code, or enforce a dense format if token efficiency is prioritized.22

Implementation Strategy:  
We propose a compiler utility within the STRling tooling/ directory that automates this conversion. This tool reads spec/grammar/dsl.ebnf, resolves imports, and emits a strling.gbnf file. This file ensures that any update to the core STRling grammar is immediately reflected in the constraints available to the LLM.

### **3.2 Solving the Left-Recursion Challenge**

While STRling's high-level structure avoids direct left recursion, complex nested expressions in regex can inadvertently introduce it during grammar transformation. The research indicates that llama.cpp's grammar parser creates separate trees for every possible pathway and can fail with stack exhaustion or infinite loops on left-recursive rules.23

**Mitigation:** The STRling grammar utilizes iterative constructs ({... }) rather than recursive definitions for repetition. For example, Quantifier is applied as a suffix to an Atom (Term \= Atom, \[ Quantifier \]), which is inherently right-associative or iterative in parsing logic. This design choice proves critical for GBNF compatibility. By maintaining this iterative structure in the GBNF output (using \* and \+ operators rather than recursive non-terminals), we ensure compatibility with the llama.cpp decoder.

### **3.3 The "Approximation Strategy" for Context-Sensitivity**

As identified in the Representability Gap, GBNF cannot enforce context-sensitive rules like valid backreferences. We address this through a two-stage process:

1. **Constrained Sampling (Stage 1):** Use GBNF to enforce the *syntax* of backreferences (e.g., \\k\< followed by an identifier followed by \>). This prevents the model from generating gibberish like \\k\<123 or unclosed references.  
2. **Parser Verification (Stage 2):** Once the generation is complete, the string is passed to the STRling Parser. The parser's AST construction phase includes logic to resolve named groups. If a backreference points to an undefined name, the parser throws a ValidationError.5

This separation of concerns allows the constrained decoding engine to focus on what it does best (structural guidance) while offloading semantic verification to the symbolic engine (STRling).

## **4\. Bidirectional Deconstruction: Validating Intent**

The "Symbolic Bridge" is bidirectional. It is not enough to guide the LLM; we must also be able to ingest its output and verify that the generated logic aligns with the user's intent. This process is "Bidirectional Deconstruction."

### **4.1 The Deconstruction Pipeline**

Deconstruction is the process of converting the linear STRling DSL generated by the LLM back into a structured Abstract Syntax Tree (AST). This pipeline leverages the existing STRling.core.parser infrastructure.5

**Process Flow:**

1. **Input:** The LLM generates a pattern string, e.g., s.merge(s.digit(3), "-").  
2. **Lexing:** The parser tokenizes the input, identifying primitives (digit), quantifiers (3), and literals (-).  
3. **AST Construction:** The tokens are assembled into Node objects. s.digit(3) becomes a Quant node containing a CharClass node (representing digits).5  
4. **IR Lowering:** The AST is compiled into the Intermediate Representation (IR), normalizing the structure. For instance, s.merge creates a Seq (Sequence) node.5

### **4.2 Hallucination Detection via Structural Analysis**

LLM hallucinations in code generation often manifest as subtle logic errors rather than syntax errors. By inspecting the AST/IR, these hallucinations become detectable structural patterns.

* **Redundant Quantifiers:** An LLM might generate (a+)+. In the AST, this appears as a Quant node nested immediately inside another Quant node. This specific structure is a known heuristic for ReDoS vulnerability and logic error. The system can flag this structure immediately.26  
* **Contradictory Logic:** Consider a generated pattern (?=a)b. The AST reveals a LookAhead node asserting a, followed by a Lit node matching b. A static analysis pass can determine that FIRST(b) does not intersect with the assertion a, rendering the pattern effectively FAIL. This is a semantic hallucination—syntactically valid but logically impossible—which the AST exposes.  
* **Invalid Unicode Properties:** If an LLM hallucinates a non-existent Unicode property \\p{IsElvish}, the parser's validation logic (which checks against a registry of valid properties) will reject it during the AST construction phase.5

### **4.3 Syntactic Intent vs. Implementation Details**

The AST allows us to decouple the user's *intent* from the specific implementation details of the regex engine.

* **Intent:** "Match a US Phone Number."  
* **Implementation:** The LLM generates a STRling pattern.  
* **Verification:** We can programmatically verify if the AST structure conforms to the intent. For example, does the AST root contain a Seq node? Does that sequence contain exactly 10 distinct digit consumptions (implied by digit(3) \+ digit(3) \+ digit(4))?

This enables **Policy-as-Code** for regex. Organizations can define policies such as "All patterns must be anchored" or "No unbounded quantifiers allowed." These policies are checked against the AST. If the LLM generates an unanchored pattern, the system detects the missing Anchor nodes at the root of the AST 5 and rejects the generation, prompting the LLM to correct it.

## **5\. Auditable Guardrails: The Science of Safety**

The most severe risk in automated regex generation is ReDoS. Traditional testing (fuzzing) is probabilistic and may miss edge cases. We propose a deterministic, mathematically grounded "Critic" layer based on Symbolic Static Analysis.

### **5.1 ReDoS Theory and NFA Ambiguity**

ReDoS vulnerabilities arise from **Exponential Ambiguity** in the Nondeterministic Finite Automaton (NFA) constructed from a regex. This occurs when there are multiple paths through the automaton to match the same input string, specifically when these paths involve loops.3

Common vulnerability patterns include:

* **Nested Quantifiers (NQ):** (a+)+  
* **Overlapping Adjacencies (OA):** \\d+\\w+ (where \\d is a subset of \\w)

LLMs are notoriously bad at detecting these because they lack the computational model to simulate the NFA state explosion. They judge patterns by "visual similarity" to training data, not by structural safety.

### **5.2 Brzozowski Derivatives as a Verification Tool**

Brzozowski Derivatives offer a symbolic method to analyze regular expressions without explicitly constructing the full NFA/DFA, making them suitable for static analysis.27

The Derivative Operation:  
The derivative of a regex $R$ with respect to a symbol $a$, denoted $D\_a(R)$, is the regex representing the set of strings $s$ such that $as$ matches $R$.

$$D\_a(R) \= \\{ s \\mid as \\in L(R) \\}$$  
By recursively computing derivatives, we can explore the state space of the regex.

* **Ambiguity Detection:** A regex is ambiguous if, for some input string $w$, there is more than one path through the derivative graph that leads to a nullable state (a match).  
* **Cycle Analysis:** If we detect a cycle in the derivative graph that is both *nullable* (can match empty string) and *branching* (has multiple ways to proceed), we have identified a potential ReDoS vector.

### **5.3 The STRling "Critic" Layer**

We propose integrating a **Critic** module into the STRling compiler pipeline that operates on the Intermediate Representation (IR).

**Architecture of the Critic:**

1. **IR Ingestion:** Receive the IRRoot from the Compiler.  
2. **Structural Heuristics (Fast Pass):**  
   * Scan the IR tree for IRQuant nodes.  
   * Flag any IRQuant whose child subtree contains another IRQuant (Nested Quantifier detection).5  
   * Flag adjacent IRSeq items with overlapping character sets (e.g., IRCharClass vs IRCharClass intersection analysis).  
3. **Symbolic Derivative Analysis (Deep Pass):**  
   * For flagged substructures, convert the IR into a symbolic algebraic form.  
   * Compute Brzozowski derivatives for relevant alphabet symbols.  
   * Check for "constructive interference" where multiple derivative paths remain valid for the same input sequence.  
4. **Verdict:** If ambiguity is detected, the Critic rejects the pattern *before* it is emitted to PCRE2.

This approach provides a **Formal Verification** guarantee. Unlike a timeout-based guardrail (which stops a running attack), this guardrail proves that the attack *cannot exist* in the generated code.

### **5.4 Formal Verification of Lookarounds**

STRling supports lookarounds 5, which complicate derivative analysis because they do not consume input in the standard way.

* **Challenge:** Standard Brzozowski derivatives are defined for consuming matches. Lookarounds act as boolean predicates on the current state.  
* **Solution:** The Critic treats lookaround nodes (IRLook) as "Guard Conditions" on the transitions in the derivative graph. While full verification of nested lookarounds is computationally expensive, we can apply a conservative safety policy: *The contents of a lookaround must be 1-unambiguous.* By verifying the lookaround's internal logic independently using derivatives, we ensure it terminates quickly, thus securing the overall pattern.30

## **6\. Human-Governable Interfaces: The "Simply" Medium**

A robust AI system must keep the human in the loop. However, asking a human to debug a raw, AI-generated regex string ^((?\>\[a-zA-Z\\d\!\#$%&'\*+\\-/=?^\_{|}\~\]+\\x20\*|"((?=\[\\x01-\\x7f\])\[^"\\\]|\\\[\\x01-\\x7f\])*"\\x20*)\*(?\<))?\` is cognitively overwhelming. STRling solves this by offering the **"Simply" API** as a human-readable medium.

### **6.1 Modularity as an Interface**

The "Simply" API 5 is an object-oriented DSL that mirrors the structure of the AST. It allows patterns to be built from named, composable units.

**Comparison:**

* **Raw Regex:** (?\<area\>\\d{3})  
* **STRling:** s.group("area", s.digit(3))

The STRling format is self-documenting. It makes the *structure* of the pattern explicit. The grouping, the quantification, and the naming are first-class citizens in the code, not embedded syntax markers.

### **6.2 The Editing Workflow**

STRling enables a novel "Edit-Refine" workflow for AI interaction:

1. **Prompt:** User asks LLM: "Generate a regex for a SKU code that starts with 2 letters, a hyphen, and 4 digits."  
2. **Generation:** LLM outputs STRling code:  
   Python  
   sku \= s.merge(  
       s.letter(2),  
       s.lit("-"),  
       s.digit(4)  
   )

3. **Governance (Human Edit):** The user reviews the code. They realize the letters must be uppercase. Instead of deciphering \[a-zA-Z\], they simply change s.letter(2) to s.upper(2) (assuming such a helper exists or is easily composed).  
4. **Constraint Injection:** The user can wrap this pattern in s.capture(...) or add it to a larger structure easily using Python/JS syntax, utilizing the modularity of the Pattern objects.5  
5. **Final Compilation:** The user runs the code to generate the optimized, safe PCRE2 string.

This workflow leverages the AI for the "blank page" problem while giving the human absolute, granular control over the final logic through a high-level interface. It turns the AI into a "Drafter" and the human into an "Editor."

## **7\. Architecture & Implementation Feasibility**

The feasibility of this system rests on the robustness of the STRling architecture. The analysis of the provided codebase confirms that the necessary components are present and mature.

### **7.1 The Iron Law of Emitters**

The "Iron Law of Emitters" 5 is the foundational architectural principle of STRling. It mandates that emitters must be:

1. **Deterministic:** emit(IR, Config) always yields the same string.  
2. **Side-Effect Free:** No external state dependencies.  
3. **Logic-Free:** Emitters translate; they do not interpret. Logic resides in the IR.

This law is crucial for the Neuro-Symbolic bridge. It guarantees that if the **Critic** layer verifies the safety of an IR tree, the **Emitter** will not inadvertently introduce a vulnerability during the string generation phase. It establishes a "Chain of Trust" from the AST validation to the final deployment.

### **7.2 Component Readiness**

* **Parsing:** Recursive descent parsers for Python 5 and JS 5 are implemented and tested.  
* **IR:** The Intermediate Representation is normalized and serializable 5, ready for consumption by the Critic.  
* **Emitters:** The PCRE2 emitter is robust and handles complex escaping and features.5  
* **Testing:** The "3-Test Standard" 5 ensures that every feature (and thus every grammar rule) is verified via Unit, E2E, and Conformance tests.

### **7.3 Feasibility Assessment**

The integration is high-feasibility.

* **GBNF Generation:** A translator from dsl.ebnf to gbnf is a straightforward compiler task.  
* **Critic Layer:** The logic for traversing the IR tree already exists in the Compiler class.5 Adding ReDoS heuristics to this traversal is a direct extension of existing patterns.  
* **LLM Integration:** Existing libraries like llama.cpp and guidance already support the necessary hooks for grammar-constrained generation.

## **8\. Conclusion**

The "Black Box" problem in AI pattern generation is not a failure of the model's intelligence, but a failure of the interface. We are asking probabilistic engines to speak strict symbolic dialects without a translator. **STRling** provides that translator.

By implementing STRling as a Symbolic Bridge, we achieve:

1. **Syntactic Guarantee:** Through GBNF-constrained decoding derived from STRling's grammar.  
2. **Semantic Verification:** Through bidirectional deconstruction into the STRling AST.  
3. **Provable Safety:** Through Brzozowski derivative-based static analysis of the IR.  
4. **Human Governance:** Through the modular, readable "Simply" API.

This architecture moves the industry beyond "hope-based" generation (generating raw regex and hoping it works) to "verification-based" engineering (generating logic, verifying it, and then emitting code). It is the viable, necessary path forward for secure and reliable AI-driven development.

## ---

**9\. Technical Addendum: Deep Dive & Future Directions**

### **9.1 The Representability Gap in Detail**

The "Representability Gap" is the mathematical delta between the set of languages an LLM *can* generate under constraint versus the set of languages the target system *expects*.

* **JSON Schema:** Restricts output to the set of valid JSON documents (Context-Free).  
* **Regex Target:** PCRE2 patterns (Context-Sensitive due to backreferences/recursion).  
* **Gap:** The constraints cannot model the target. An LLM can generate a valid JSON string that contains an invalid PCRE2 pattern.  
* **STRling Solution:** STRling's IR is designed to map the semantic features of PCRE2 (atomic groups, recursion) into structured nodes (IRGroup, IRQuant). By constraining the LLM to STRling syntax, we lift the constraint space to match the target space complexity.

### **9.2 ReDoS Detection Algorithm Specification**

The Critic's ReDoS detection should implement the following algorithm on the STRling IR:

1. **Flattening:** Resolve all IRSeq and IRAlt nested structures to a canonical form.  
2. **Graph Construction:** Build a dependency graph of the pattern where nodes are atoms and edges represent transitions.  
3. **Cycle Detection:** Identify Strong Connected Components (SCCs) in the graph.  
4. **Nullable Cycle Check:** For every cycle, determine if the path consumes input.  
   * If Cycle consumes ε (empty string) \-\> **Infinite Loop Risk**.  
5. **Ambiguity Check:** For every IRAlt node (A|B):  
   * Compute Intersect(A, B). If non-empty \-\> **Ambiguity Risk**.  
6. **Nested Quantifier Check:** For every IRQuant node Q over atom A:  
   * If A contains IRQuant \-\> **Exponential Blowup Risk**.

### **9.3 GBNF Mapping Technicalities**

To ensure robust GBNF generation:

* **Whitespace:** Explicitly define ws ::= \[ \\t\\n\]\* and insert it between every semantic token in the GBNF rules to allow the LLM to format code naturally.  
* **Terminals:** Map STRling literals to exact string terminals (e.g., s.digit \-\> "s.digit").  
* **Recursion Handling:** Since llama.cpp has issues with left recursion, the dsl.ebnf to gbnf transpiler must perform **Left Recursion Elimination** algorithms (like transforming A ::= A a | b to A ::= b A' and A' ::= a A' | ε) if the native EBNF contains such structures. The current iterative design of STRling EBNF largely mitigates this, but automated verification is recommended.

### **9.4 Future Work: The "Repair" Agent**

An extension of this architecture is the "Repair Agent." If the Critic rejects a pattern (e.g., for ReDoS), the specific error (e.g., "Nested quantifier at node X") can be fed back to the LLM. Because STRling is text-based code, the LLM can rewrite the specific line of code to fix the vulnerability, guided by the symbolic error message. This creates a self-healing generation loop.

#### **Works cited**

1. Neuro-symbolic AI \- Wikipedia, accessed December 30, 2025, [https://en.wikipedia.org/wiki/Neuro-symbolic\_AI](https://en.wikipedia.org/wiki/Neuro-symbolic_AI)  
2. Neuro Symbolic Architectures with Artificial Intelligence for Collaborative Control and Intention Prediction \- GSC Online Press, accessed December 30, 2025, [https://gsconlinepress.com/journals/gscarr/sites/default/files/GSCARR-2025-0288.pdf](https://gsconlinepress.com/journals/gscarr/sites/default/files/GSCARR-2025-0288.pdf)  
3. What is Regular Expression Denial of Service (ReDoS)? \- Imperva, accessed December 30, 2025, [https://www.imperva.com/learn/ddos/regular-expression-denial-of-service-redos/](https://www.imperva.com/learn/ddos/regular-expression-denial-of-service-redos/)  
4. ReDoSHunter: A Combined Static and Dynamic Approach for Regular Expression DoS Detection \- USENIX, accessed December 30, 2025, [https://www.usenix.org/system/files/sec21-li-yeting.pdf](https://www.usenix.org/system/files/sec21-li-yeting.pdf)  
5. thecyberlocal/strling  
6. Neuro-Symbolic AI: Explainability, Challenges, and Future Trends \- arXiv, accessed December 30, 2025, [https://arxiv.org/html/2411.04383v1](https://arxiv.org/html/2411.04383v1)  
7. Architectural patterns for neuro-symbolic AI \- Vrije Universiteit Amsterdam, accessed December 30, 2025, [https://research.vu.nl/en/publications/architectural-patterns-for-neuro-symbolic-ai/](https://research.vu.nl/en/publications/architectural-patterns-for-neuro-symbolic-ai/)  
8. Constrained Grammars :: LocalAI, accessed December 30, 2025, [https://localai.io/features/constrained\_grammars/](https://localai.io/features/constrained_grammars/)  
9. Diving Deeper with Structured Outputs | by Armin Catovic | TDS Archive \- Medium, accessed December 30, 2025, [https://medium.com/data-science/diving-deeper-with-structured-outputs-b4a5d280c208](https://medium.com/data-science/diving-deeper-with-structured-outputs-b4a5d280c208)  
10. IohannesArnold/xml\_gbnf: A GBNF grammar of XML for use in llama.cpp \- GitHub, accessed December 30, 2025, [https://github.com/IohannesArnold/xml\_gbnf](https://github.com/IohannesArnold/xml_gbnf)  
11. Constrained Decoding Mechanism \- Emergent Mind, accessed December 30, 2025, [https://www.emergentmind.com/topics/constrained-decoding-mechanism](https://www.emergentmind.com/topics/constrained-decoding-mechanism)  
12. Constraining LLM Outputs with Finite State Machines | by Chirag Bajaj | Medium, accessed December 30, 2025, [https://medium.com/@chiragbajaj25/constraining-llm-outputs-with-finite-state-machines-79ca9e336b1f](https://medium.com/@chiragbajaj25/constraining-llm-outputs-with-finite-state-machines-79ca9e336b1f)  
13. Outlines \- Docs by LangChain, accessed December 30, 2025, [https://docs.langchain.com/oss/python/integrations/providers/outlines](https://docs.langchain.com/oss/python/integrations/providers/outlines)  
14. Welcome to Outlines\!, accessed December 30, 2025, [https://dottxt-ai.github.io/outlines/](https://dottxt-ai.github.io/outlines/)  
15. If I'm not mistaken, even JSON couldn't be parsed by a regex due to the recursiv... | Hacker News, accessed December 30, 2025, [https://news.ycombinator.com/item?id=45478580](https://news.ycombinator.com/item?id=45478580)  
16. A comparison of regex engines \- Rust Leipzig, accessed December 30, 2025, [https://rust-leipzig.github.io/regex/2017/03/28/comparison-of-regex-engines/](https://rust-leipzig.github.io/regex/2017/03/28/comparison-of-regex-engines/)  
17. Outline mode in EBNF \- parsing \- Stack Overflow, accessed December 30, 2025, [https://stackoverflow.com/questions/20716928/outline-mode-in-ebnf](https://stackoverflow.com/questions/20716928/outline-mode-in-ebnf)  
18. Regex Tutorial: Backreferences To Match The Same Text Again, accessed December 30, 2025, [https://www.regular-expressions.info/backref.html](https://www.regular-expressions.info/backref.html)  
19. How to simulate backreferences, lookaheads, and lookbehinds in finite state automata?, accessed December 30, 2025, [https://cs.stackexchange.com/questions/2557/how-to-simulate-backreferences-lookaheads-and-lookbehinds-in-finite-state-auto](https://cs.stackexchange.com/questions/2557/how-to-simulate-backreferences-lookaheads-and-lookbehinds-in-finite-state-auto)  
20. Regex Tutorial: Atomic Grouping, accessed December 30, 2025, [https://www.regular-expressions.info/atomic.html](https://www.regular-expressions.info/atomic.html)  
21. llama.cpp/grammars/README.md at master · ggml-org/llama.cpp · GitHub, accessed December 30, 2025, [https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)  
22. grammars/README.md · b2444 \- Llama.Cpp \- GitLab, accessed December 30, 2025, [https://gitlab.informatik.uni-halle.de/ambcj/llama.cpp/-/blob/b2444/grammars/README.md](https://gitlab.informatik.uni-halle.de/ambcj/llama.cpp/-/blob/b2444/grammars/README.md)  
23. Bug: GBNF repetition rewrite results in unsupported left recursion · Issue \#7572 · ggml-org/llama.cpp \- GitHub, accessed December 30, 2025, [https://github.com/ggml-org/llama.cpp/issues/7572](https://github.com/ggml-org/llama.cpp/issues/7572)  
24. speed-up grammar sampling · Issue \#4218 · ggml-org/llama.cpp \- GitHub, accessed December 30, 2025, [https://github.com/ggml-org/llama.cpp/issues/4218](https://github.com/ggml-org/llama.cpp/issues/4218)  
25. Lookahead assertion: (?=...), (?\!...) \- JavaScript \- MDN Web Docs \- Mozilla, accessed December 30, 2025, [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular\_expressions/Lookahead\_assertion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Lookahead_assertion)  
26. Insecure Use of Regular Expressions \- GuardRails, accessed December 30, 2025, [https://docs.guardrails.io/docs/vulnerabilities/javascript/insecure\_use\_of\_regular\_expressions](https://docs.guardrails.io/docs/vulnerabilities/javascript/insecure_use_of_regular_expressions)  
27. Brzozowski derivative \- Wikipedia, accessed December 30, 2025, [https://en.wikipedia.org/wiki/Brzozowski\_derivative](https://en.wikipedia.org/wiki/Brzozowski_derivative)  
28. Derivatives of Regular Expressions \- Janusz A Brzozowski.md \- GitHub, accessed December 30, 2025, [https://github.com/awalterschulze/regex-reexamined-coq/blob/main/src/Brzozowski/Derivatives%20of%20Regular%20Expressions%20-%20Janusz%20A%20Brzozowski.md](https://github.com/awalterschulze/regex-reexamined-coq/blob/main/src/Brzozowski/Derivatives%20of%20Regular%20Expressions%20-%20Janusz%20A%20Brzozowski.md)  
29. rzozowski: a Brzozowski derivative-based regex crate for the real world : r/rust \- Reddit, accessed December 30, 2025, [https://www.reddit.com/r/rust/comments/1k0sems/rzozowski\_a\_brzozowski\_derivativebased\_regex/](https://www.reddit.com/r/rust/comments/1k0sems/rzozowski_a_brzozowski_derivativebased_regex/)  
30. Efficient Matching of Regular Expressions with Lookaround Assertions \- Konstantinos Mamouras, accessed December 30, 2025, [https://kmamouras.github.io/papers/regex-lookaround-draft-POPL'24.pdf](https://kmamouras.github.io/papers/regex-lookaround-draft-POPL'24.pdf)