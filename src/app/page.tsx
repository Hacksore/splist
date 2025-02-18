"use client";

import { Artist, Page, SpotifyApi, Track } from "@spotify/web-api-ts-sdk"; // use "@spotify/web-api-ts-sdk" in your own project

import sdk from "@/lib/spotify-sdk/ClientInstance";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { CopyButton } from "@/components/ui/copy-button";
// TODO: add later
import Image from "next/image";
import SignIn from "@/components/SignIn";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import MadeBy from "@/components/MadeBy";
import { Icons } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchTerm } from "@/lib/utils";

const validTerms: SearchTerm[] = ["short_term", "long_term", "medium_term"];
const frames: Record<SearchTerm, string> = {
  "short_term": "four weeks",
  "medium_term": "six months",
  "long_term": "one year"
}

// Type guard function to check if a value is a valid SearchTerm
function isValidSearchTerm(value: any): value is SearchTerm {
  return validTerms.includes(value);
}

export default function Home() {
  const session = useSession();
  const { toast } = useToast();

  if (!session || session.status !== "authenticated") {
    return <SignIn />;
  }

  return (
    // gap-8 same as mobi navbar gap
    <main className="flex flex-col gap-8 md:p-12 p-6">
      <Navbar showSignOut userName={session.data.user?.name} userImage={session.data.user?.image} />
      <SpotifySearch sdk={sdk} toast={toast} />
      <MadeBy />
      <Toaster />
    </main>
  );
}

function SpotifySearch({ sdk, toast }: { sdk: SpotifyApi; toast: any }) {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const limit = 5;

  const [loadingCopy, setLoadingCopy] = useState(false);
  const [loadingTopItems, setLoadingTopItems] = useState(true);
  const [timeFrame, setTimeFrame] = useState<SearchTerm>("short_term");
  const [topArtists, setTopArtists] = useState<Page<Artist>>({} as Page<Artist>);
  const [topTracks, setTopTracks] = useState<Page<Track>>({} as Page<Track>);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = searchParams.get("search");
  // Validate search term
  const validatedSearch: SearchTerm = isValidSearchTerm(search) ? search : "short_term";

  useEffect(() => {
    (async () => {
      // For now, just short term top artists
      // TODO: make these requests in parallel

      const topArtists: Page<Artist> = await sdk.currentUser.topItems(
        "artists",
        validatedSearch,
        limit
      );
      setTopArtists(() => topArtists);

      const topTracks: Page<Track> = await sdk.currentUser.topItems("tracks", validatedSearch, limit);

      setTopTracks(() => topTracks);
      setLoadingTopItems(false);
    })();
  }, [sdk]);

  // Generate a table for the artists
  const artistTable = topArtists?.items?.map((artist, index) => {
    return (
      <li
        key={"artist " + artist.id}
        className="transition-all duration-150 hover:cursor-pointer hover:opacity-80 h-[50px] w-[270px]"
      >
        <a
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4"
        >
          <span>{index + 1}</span>
          <div className="flex justify-center items-center w-[50px] h-[50px] rounded-[50%] overflow-hidden ">
            <img width={50} src={artist.images[2].url} alt={artist.name + " image"} />
          </div>
          <span className="w-[167px] line-clamp-2">{artist.name}</span>
        </a>
      </li>
    );
  });

  // Generate a table for the artists
  const trackTable = topTracks?.items?.map((track, index) => {
    return (
      <li
        key={"track " + track.id}
        className="transition-all duration-150 hover:cursor-pointer hover:opacity-80 h-[50px] w-[270px]"
      >
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4"
        >
          <span>{index + 1}</span>
          <div className="flex flex-col">
            <span className="truncate w-[200px]"> {track.name}</span>
            <span className="opacity-80 text-xs truncate w-[167px]">{track.artists[0].name}</span>
          </div>
        </a>
      </li>
    );
  });

  const skeletons = Array.from({ length: limit }).map((_, index) => (
    <Skeleton key={index} className="h-[50px] w-[270px]" />
  ));

  function updateQueryParam(timeFrame: SearchTerm) {
    const params = new URLSearchParams();
    params.set("search", timeFrame);
    router.replace(`${pathname}?${params.toString()}`);
  }

  // Generate image on copy
  async function getAndCopyImage() {
    setLoadingCopy(true);
    try {
      const res = await fetch("/api/og", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topArtists: topArtists.items,
          topTracks: topTracks.items,
          timeFrame: frames[timeFrame],
        }),
      });

      if (res.ok) {
        const blob = await res.blob();

        // Check for navigator apis
        if (typeof navigator?.share === "function") {
          await shareImage(blob);
        } else if (typeof navigator?.clipboard?.write === "function") {
          await copyImageToClipboard(blob);
        } else {
          handleUnsupportedAPI();
        }
      } else {
        throw new Error("Failed to fetch the image.");
      }
    } catch (err) {
      console.error(err);
      showToast(
        "Image Copy Failed",
        "Oops, the image failed to be copied to your clipboard!",
        "destructive"
      );
    }
    setLoadingCopy(false);
  }

  async function shareImage(blob: Blob) {
    const file = new File([blob], "splist.png", { type: blob.type });

    try {
      await navigator.share({
        title: "Share Image",
        text: "Check out my Splist!",
        files: [file],
      });
      showToast("Image Shared", "The image has been shared successfully!");
    } catch (err) {
      console.error("Share failed", err);
      showToast("Image Share Stopped", "Oops, the image failed to be shared!", "destructive");
    }
  }

  async function copyImageToClipboard(blob: Blob) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      showToast("Image Copied", "The image has been copied to your clipboard!");
    } catch (err) {
      console.error("Clipboard write failed", err);
      showToast(
        "Image Copy Failed",
        "Oops, the image failed to be copied to your clipboard!",
        "destructive"
      );
    }
  }

  function handleUnsupportedAPI() {
    console.error("Share not supported");
    showToast(
      "Share Not Supported",
      "Your browser does not support the Web Share/Clipboard API.",
      "destructive"
    );
  }

  function showToast(title: string, description: string, variant = "default") {
    toast({
      title,
      description,
      variant,
    });
  }

  async function handleSelectUpdate(timeFrame: SearchTerm) {
    setLoadingTopItems(true);

    // Fetch new data
    const topArtists: Page<Artist> = await sdk.currentUser.topItems("artists", timeFrame, limit);

    setTopArtists(() => topArtists);

    const topTracks: Page<Track> = await sdk.currentUser.topItems("tracks", timeFrame, limit);

    setTopTracks(() => topTracks);
    setTimeFrame(timeFrame);
    updateQueryParam(timeFrame);
    setLoadingTopItems(false);
  }

  return (
    <div
      id="splist-card"
      className="relative self-center max-w-fit bg-neutral-950 text-white gap-8 flex flex-col border-2 border-neutral-700 rounded-xl p-6 sm:p-12"
      aria-label="Splist Card"
    >
      {/* Header */}
      <div className="space-between flex items-center gap-4">
        <img width={80} height={80} src="/splist-logo.png" alt="splist logo" />
        <div className="flex flex-col gap-2">
          <div className="text-3xl md:text-4xl">Splist</div>
          <div>https://splist-lac.vercel.app/</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Select onValueChange={handleSelectUpdate} defaultValue={validatedSearch}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Four weeks" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time frame</SelectLabel>
              <SelectItem value="short_term">Four weeks</SelectItem>
              <SelectItem value="medium_term">Six months</SelectItem>
              <SelectItem value="long_term">One year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <CopyButton
          disabled={loadingCopy || loadingTopItems}
          id="copy-button"
          className="flex gap-2"
          onClick={getAndCopyImage}
        >
          <span>Copy to Clipboard</span>
          {loadingCopy ? <Icons.loading /> : <Icons.copy />}
        </CopyButton>
      </div>

      {/* Date information */}
      <div className="flex text-xl opacity-80">
        Past {frames[validatedSearch]} as of {month}/{day}/{year}
      </div>
      {/* Table */}
      <div className="flex-col md:flex-row flex gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="opacity-80 text-lg">Top Artists</h3>
          <ol key={"artistTable"} className="flex flex-col gap-4">
            {artistTable ? artistTable : skeletons}
          </ol>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="opacity-80 text-lg">Top Songs</h3>
          <ol key={"trackTable"} className="flex flex-col gap-4 ">
            {trackTable ? trackTable : skeletons}
          </ol>
        </div>
      </div>
    </div>
  );
}
