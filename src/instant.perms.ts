import type {InstantRules} from "@instantdb/react"

const rulse = {
    $users:{
        allow:{
         view: 'isAdmin || auth.id == data.id',
         update: 'auth.id == data.id',
         delete: 'isAdmin',
         create: 'isAdmin',    
        },
        bind: {
            isAdmin: "'admin' in auth.ref('$user.roles.type')",
        }
    },
    $products:{
        allow:{
        }
    }
} satisfies InstantRules;

export default rulse;
