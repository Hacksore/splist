import { Icons } from "./icons";

export default function MadeBy() {
  return (
    <div className="items-center gap-4 w-full flex flex-col justify-center">
      <div>
        <span>
          Made with ❤️ by{" "}
          <a
            className="underline transition-all duration-150 hover:opacity-80"
            href="https://github.com/maxdemaio"
          >
            Max DeMaio
          </a>
        </span>
      </div>

      <a href="https://github.com/maxdemaio/splist" className="underline transition-all duration-150 hover:opacity-80">
        💫 Star on GitHub 
      </a>
    </div>
  );
}
