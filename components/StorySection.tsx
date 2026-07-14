import Reveal from "./Reveal";

export default function StorySection({
  id,
  eyebrow,
  title,
  copy,
  image,
  align = "left",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  align?: "left" | "right";
}) {
  return (
    <section id={id} className="relative h-screen w-full overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={`absolute inset-0 flex items-center px-6 md:px-16 ${
          align === "right" ? "justify-end text-right" : "justify-start text-left"
        }`}
      >
        <Reveal className="max-w-md">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h3 className="headline text-3xl md:text-5xl mb-4">{title}</h3>
          <p className="text-sm md:text-base text-white/80 leading-relaxed">{copy}</p>
        </Reveal>
      </div>
    </section>
  );
}
