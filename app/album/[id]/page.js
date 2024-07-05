'use client'
import AlbumDetails from "@/app/albumDetail/page";
import { useParams } from "next/navigation";


export default function AlbumPage() {
  const params = useParams();
  const id = params.id
 

  return <AlbumDetails id={id} />;
}