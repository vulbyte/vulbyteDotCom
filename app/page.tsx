import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="bg-[%222] h-screen">
        <div className="w-fit m-auto">
          <br /> <br />
          <p> welcome to </p>
          <h1 className="text-white">
            <span className="text-[#ff0000]">v</span>
            <span className="text-[#ffff00]">u</span>
            <span className="text-[#00ff00]">l</span>
            <span className="text-[#00ffff]">b</span>
            <span className="text-[#0000ff]">y</span>
            <span className="text-[#ff00ff]">t</span>
            <span className="text-[#ff0000]">e</span>
            {`'s website`}
          </h1>
          <br />
          <p className="bg-yellow-50 p-5 max-w-[60em]">
            {`
		please know that this site is a project website, which i use mainly as a dump. many parts of this aren't meant to be "consumer facing", so if you encounter roughness, sorry! but i'm also probably not gonna fix it lolz
            `}
          </p>
        </div>
        <div>
          <h2>
            {`
							bored? don't know what to do? check out these things:
						`}
          </h2>
          <ul>
            <li>
              <a href="vulbyte.com/links/">
                {`my socials (especally my youtube)`}
              </a>
            </li>
            <li>
              <a href="vulbyte.com/projects/">{`some of my random projects`}</a>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
