import schema from "@/instant.schema";
import { init } from "@instantdb/react";

const db = init({
    appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID || "15965306-4c1b-425f-ab5b-8b8a41ffcb39",
    // adminToken: process.env.INSTANT_APP_ADMIN_TOKEN || "c89d31dd-c2fb-41fe-9e67-c0946668be33",
    schema: schema
})

export default db