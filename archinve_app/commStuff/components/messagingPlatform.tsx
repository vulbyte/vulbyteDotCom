"use client";

export default function MessagingPlatformForm() {
  return (
    <div>
      <h3 className="text-xl"> messaging platform </h3>
      <h6 className="text-gray-500">
        please select at least 2 for backup or if one service is down
      </h6>
      <form id="messaging platform">
        <input type="checkbox" name="communicationPlatform" value="discord" />
        <label htmlFor="discord"> discord </label>
        <br />
        <input type="checkbox" name="communicationPlatform" value="telegram" />
        <label htmlFor="telegram"> telegram </label>
        <br />
        <input type="checkbox" name="communicationPlatform" value="other" />
        <label htmlFor="other"> other </label>
        <br />
      </form>
      <br />
      <br />
    </div>
  );
}
