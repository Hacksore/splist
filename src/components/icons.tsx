export const Icons = {
  github: function GithubIcon(props: any) {
    return (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.0001 4.16663C22.2642 4.16663 19.5551 4.7055 17.0275 5.75247C14.4999 6.79944 12.2032 8.33401 10.2687 10.2686C6.36168 14.1756 4.16675 19.4746 4.16675 25C4.16675 34.2083 10.1459 42.0208 18.4167 44.7916C19.4584 44.9583 19.7917 44.3125 19.7917 43.75V40.2291C14.0209 41.4791 12.7917 37.4375 12.7917 37.4375C11.8334 35.0208 10.4792 34.375 10.4792 34.375C8.58341 33.0833 10.6251 33.125 10.6251 33.125C12.7084 33.2708 13.8126 35.2708 13.8126 35.2708C15.6251 38.4375 18.6876 37.5 19.8751 37C20.0626 35.6458 20.6042 34.7291 21.1876 34.2083C16.5626 33.6875 11.7084 31.8958 11.7084 23.9583C11.7084 21.6458 12.5001 19.7916 13.8542 18.3125C13.6459 17.7916 12.9167 15.625 14.0626 12.8125C14.0626 12.8125 15.8126 12.25 19.7917 14.9375C21.4376 14.4791 23.2292 14.25 25.0001 14.25C26.7709 14.25 28.5626 14.4791 30.2084 14.9375C34.1876 12.25 35.9376 12.8125 35.9376 12.8125C37.0834 15.625 36.3542 17.7916 36.1459 18.3125C37.5001 19.7916 38.2917 21.6458 38.2917 23.9583C38.2917 31.9166 33.4167 33.6666 28.7709 34.1875C29.5209 34.8333 30.2084 36.1041 30.2084 38.0416V43.75C30.2084 44.3125 30.5417 44.9791 31.6042 44.7916C39.8751 42 45.8334 34.2083 45.8334 25C45.8334 22.2641 45.2945 19.555 44.2476 17.0274C43.2006 14.4998 41.666 12.2031 39.7315 10.2686C37.7969 8.33401 35.5003 6.79944 32.9727 5.75247C30.445 4.7055 27.736 4.16663 25.0001 4.16663Z"
          fill="currentColor"
        />
      </svg>
    );
  },

  profileDefault: function ProfileDefaultIcon(props: any) {
    return (
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_23_90)">
          <path
            d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z"
            fill="#5272A1"
          />
        </g>
        <defs>
          <clipPath id="clip0_23_90">
            <rect width="64" height="64" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  },

  copy: function CopyIcon(props: any) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"
        />
      </svg>
    );
  },

  loading: function LoadingIcon(props: any) {
    return (
      <svg
        className="animate-spin h-5 w-5 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  },
};
