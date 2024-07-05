'use client'

import { useParams } from "next/navigation";
import ArtistDetail from "@/app/artistDetail/page";

export default function ArtistPage() {
  const params = useParams();
  const id = params.id
 

  return <ArtistDetail id={id} />;
}