"use client"
import { Loader2 } from "lucide-react";

export default function Loading(){
    return (
        <div className="animate-spin h-20 flex justify-center items-center">
            <Loader2/>
        </div>
    )

}