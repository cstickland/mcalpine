<script>
    import { fade } from "svelte/transition";
    import DownloadSvg from "./DownloadSvg.svelte";

    export let fileUrl;
    export let title;
</script>


<li in:fade>
    <a href={fileUrl}>
        {title}
        <div>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="file-text"
                            ><rect width="24" height="24" opacity="0" /><path
                                d="M19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67zM9 12h3a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2zm6 6H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm-.29-10a.79.79 0 0 1-.71-.85V4l3.74 4z"
                            /></g
                        ></g
                    ></svg
                >
                {fileUrl.split(".").pop()}
            </span>
            <DownloadSvg />
        </div>
    </a>
</li>

