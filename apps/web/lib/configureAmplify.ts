"use client";

import { Amplify } from "aws-amplify";
import outputs from "../../../packages/shared_auth/amplify_outputs.json";


Amplify.configure(outputs, {ssr: true});

export default function configureAmplify() {
    return null;
}