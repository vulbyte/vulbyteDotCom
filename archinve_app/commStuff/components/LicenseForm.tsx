"use client";

export default function LicenseForm() {
  return (
    <div>
      <p className="text-gray-500">
        this is where the user can select their license
      </p>

      <form>
        <input type="radio" name="non-commericial" />
        <label htmlFor="non-commercial">
          non-commercial
          <details className="bg-zinc-800">
            <summary className="text-gray-500">
              click here for details on the license
            </summary>
            this means: Non-Commercial License
            <br />
            This work is licensed under the Creative Commons
            Attribution-NonCommercial-ShareAlike 4.0 International License.
            <br />
            You are free to:
            <br />
            <ul>
              <li>
                Share: Copy and redistribute the material in any medium or
                format.
              </li>
              <li>Adapt: Remix, transform, and build upon the material. </li>
            </ul>
            <br />
            Under the following terms:
            <br />
            <ul>
              - Attribution: You must give appropriate credit, provide a link to
              the license, and indicate if changes were made. You may do so in
              any reasonable manner, but not in any way that suggests the
              licensor endorses you or your use.
              <li>
                {" "}
                NonCommercial: You may not use the material for commercial
                purposes.{" "}
              </li>
              <li>
                {" "}
                ShareAlike: If you remix, transform, or build upon the material,
                you must distribute your contributions under the same license as
                the original.{" "}
              </li>
            </ul>
            More details here:
            <a
              className="text-blue-500"
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            >
              https://creativecommons.org/licenses/by-nc-sa/4.0/{" "}
            </a>
          </details>
        </label>
        <input type="radio" name="commericial" />
        <label htmlFor="commercial">
          {" "}
          commercial
          <details className="bg-zinc-800">
            <summary className="text-gray-500">
              {" "}
              click here for details on the license{" "}
            </summary>
            This means: Commercial License
            <br />
            This work is licensed under the Creative Commons
            Attribution-ShareAlike 4.0 International License.
            <br />
            You are free to:
            <br />
            <ul>
              <li>
                {" "}
                Share: Copy and redistribute the material in any medium or
                format.
              </li>
              <li>
                {" "}
                Adapt: Remix, transform, and build upon the material for any
                purpose, even commercially.
              </li>
            </ul>
            <br />
            Under the following terms:
            <br />
            <ul>
              <li>
                Attribution: You must give appropriate credit, provide a link to
                the license, and indicate if changes were made. You may do so in
                any reasonable manner, but not in any way that suggests the
                licensor endorses you or your use.
              </li>
              <li>
                ShareAlike: If you remix, transform, or build upon the material,
                you must distribute your contributions under the same license as
                the original.
              </li>
            </ul>
            More details here:
            <a
              className="text-blue-500"
              href="https://creativecommons.org/licenses/by-sa/4.0/"
            >
              https://creativecommons.org/licenses/by-sa/4.0/
            </a>
          </details>
        </label>

        <br />
        <br />
      </form>
    </div>
  );
}
