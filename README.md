# HW3

### Screencast

https://youtu.be/q0_TYZrvu3c
      
### Conceptual Questions
    
    1. Describe some benefits and issues related to using Feature Flags. 
    
    Answer: 
    
    Benefits:
      (1) Feature flags are cheap and easy to add in the short term.
      (2) Eliminates the cost of maintaining and supporting long live branches.
      (3) Experiment toggles are short-lived toggles that can be used for marketing purposes in A/B testing.
      (4) Permission toggles are mostly long-lived optional feature switches that can be applied for implementing pricing
      strategies.
    
    Issues:
      (1) Users might use feature differently than developers expected.
      (2) But we add options, it can get harder to support and debug the system, keeping track of which flags are in which 
      state in production and test can make it harder to understand and duplicate problems.
      (3) Other danger is in releasing code that is not completely implemented, especially if you are following branching by
      abstraction and checking in work-in-progress code protected by a feature flag.
    
    2. What are some reasons for keeping servers in seperate availability zones?
    
    Answer: 
    
    The point of availability zones is that say if there is a server in Zone A and there is another server that is
    in Zone B then the probability of both go down at the same time due to any external entity is extremely small. Hence this
    allows us to construct highly reliable web services by placing servers into multiple zones such that the failure of one
    zone doesn't disrupt the service, or at the very least, allows us to rapidly reconstruct the service 
    in the second zone.
    
    3. Describe the Circuit Breaker pattern and its relation to operation toggles.
   
    Answer:
    
    A protected function can be wrapped in a circuit breaker object which montiors for failures.  Once the failures reach a
    certain threshold, the circuit breaker trips, and all further calls to the circuit breaker return with an error, without
    the protected call being made at all. The Circuit Breaker pattern also enables an application to detect whether the fault 
    has been resolved. If the problem appears to have been fixed, the application can try to invoke the operation.A circuit
    breaker acts as a proxy for operations that might fail
    
    Operation toggles are a generalization of Circuit Breaker pattern.
    
    
    4. What are some ways you can help speed up an application that has
        a) traffic that peaks on Monday evenings
        
        Answer:
        
        More number of servers can be used to distribute the heavy load. Also different request handling mechanism can be
        used which would ensure that not all requests go to the same server.
        
        b) real time and concurrent connections with peers
        
        Answer:
        
        Load balancing can be one of the ways. Seperate servers can be also be used for smaller numbers
        
        c) heavy upload traffic
        
        Answer: 
        
        The upload can be distributed among different servers and load can be balanced. Compression can also be done in 
        order to reduce size.
        
