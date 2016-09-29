api/users/
    - GET: retorna uma lista de users, segundo critérios de busca.
        * PUBLIC
    - POST: adiciona novo user.              
        * PUBLIC
    - PUT: retorna um token após autenticação de usuário existente.
        * PUBLIC
    - DELETE: Invalida o token atual
        * PRIVATE

api/users/:userSlug
    - GET: retorna um user, segundo slug.    
        * PUBLIC
    - PUT:  atualiza user.                  
        * PRIVATE  
    - DELETE: exclui user.                   
        * PRIVATE

api/users/all/counters
    - GET: retorna uma lista de contadores de todos os usuários, segundo critérios de busca.   
        * PUBLIC

api/users/:userSlug/counters
    - GET: retorna a lista de contadores de um user, segundo critérios de busca.               
        * PUBLIC
    - POST: adiciona novo counter.              
        * PRIVATE

api/users/:userSlug/counters/:counterSlug
    - GET: retorna um counter, segundo slug.    
        * PUBLIC
    - PUT:  atualiza counter.                   
        * PRIVATE  
    - DELETE: exclui counter.                   
        * PRIVATE

api/users/:userSlug/counters/:counterSlug/stars
    - PUT:  Adiciona o counter nos favoritos do usuário.                   
        * PRIVATE  
    - DELETE: Remove o counter dos favoritos do usuário.                   
        * PRIVATE
