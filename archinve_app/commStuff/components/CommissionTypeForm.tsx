"use client";

export default function CommissionTypeForm() {
  function QuickRadioInput(
    inputName: string,
    inputValue: string,
    inputDescription: string,
  ): any {
    return (
      <div>
        <input type="radio" name={inputName} value={inputValue} />
        <label htmlFor={inputValue}>
          {inputValue}
          <br />
          <p className="text-gray-500"> {inputDescription} </p>
        </label>
      </div>
    );
  }

  return (
    <div>
      <h4> type of commission </h4>
      <p className="text-gray-500">
        please select the one that most directly applys
      </p>
      <br />
      <form>
        {QuickRadioInput(
          "commType",
          "3d model work",
          'this can be the model itself, texturing work, weight painting, rigging, and the like. if you want an animation done with a pre-existing 3d model please select "animation"',
        )}
        {QuickRadioInput(
          "commType",
          "3d print",
          "a 3d print of a model of your choice (some restrictions apply) where i 3d print your model using a high resolution resin printer then send it to you. additional options include: hand painting the model, using special resings, uv treating, and more.",
        )}
        {QuickRadioInput(
          "commType",
          "animation",
          "story, meme, and the like, regardless of medium",
        )}
        {QuickRadioInput(
          "commType",
          "coding / automation",
          "assistance with or creation of a coding related thing, this can be: creation from scratch, refactoring, consultation, web work, and the like. \n please note this is an extremely complex topic, so if oyu're inquiring about this feel free to skip this form and just email me instead (:",
        )}
        {QuickRadioInput(
          "commType",
          "branding",
          "assistance with establishing a brand, can include: logo, wordmark, colors, fonts, and more",
        )}
        {QuickRadioInput(
          "commType",
          "character_design",
          "help designing a character from scratch",
        )}
        {QuickRadioInput(
          "commType",
          "illustration_raster",
          "an illustration based on pixels. this allows for much more fine details at the cost of a finite resolution.",
        )}
        <a
          className="text-blue-800"
          href="https://www.customink.com/assets/site_content/pages/help_center/rastervector-c040dfc2ab9c1d02e95792b8c14fe64e819f207363c690d51027a79c6a728be4.gif"
        >
          for an example click here
        </a>
        {QuickRadioInput(
          "commType",
          "illustration_vector",
          "an illustration based on vectors. this allows for images with 'infinite' resolution, at the sacrifice of unique details.",
        )}
        <a
          className="text-blue-800"
          href="https://www.customink.com/assets/site_content/pages/help_center/rastervector-c040dfc2ab9c1d02e95792b8c14fe64e819f207363c690d51027a79c6a728be4.gif"
        >
          for an example click here
        </a>
      </form>
    </div>
  );
}
