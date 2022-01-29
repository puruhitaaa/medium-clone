const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h1 className="hero-h1">
          <span className="hero-span">Medium</span> is a place to write, read,
          and connect
        </h1>
        <h5>
          It's easy and free to post your thinking on any topic and connect with
          millions of readers.
        </h5>
      </div>

      <img
        alt="medium-icon"
        className="hero-img"
        src="https://bit.ly/35frEV8"
      />
    </div>
  );
};

export default Hero;
