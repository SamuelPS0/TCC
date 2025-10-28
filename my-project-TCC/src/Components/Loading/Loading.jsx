import React, { useEffect, useState } from "react";
import "./Loading.css";
import LoadingImg from '../../img/divulgaiCarregamento.png';

const textos = [
  <>Você sabia que o <span>chocolate</span> era usado como <span>moeda pelos astecas?</span></>,
  <>O <span>mel</span> nunca estraga, já foi encontrado comestível em <span>3000 anos!</span></>,
  <>O <span>abacate</span> é tecnicamente uma <span>fruta e uma semente grande!</span></>,
  <>O <span>kiwi</span> contém mais <span>vitamina C</span> que a laranja.</>,
  <>As <span>abelhas</span> podem reconhecer <span>rostos humanos</span>!</>,
  <>O <span>cacau</span> foi considerado <span>divino pelos maias</span>.</>,
  <>O <span>tomate</span> era considerado <span>venenoso na Europa</span> por um tempo.</>,
  <>O <span>morango</span> não é uma fruta verdadeira, mas sim <span>um “fruto agregado”</span>.</>,
  <>O <span>melancia</span> é composta por <span>92% de água</span>!</>,
  <>O <span>pêssego</span> tem <span>mais de 1000 variedades</span> ao redor do mundo.</>,
  <>O <span>gengibre</span> era usado como <span>moeda em algumas culturas antigas</span>.</>,
  <>O <span>pepino</span> é 96% água e ajuda na <span>hidratação</span>.</>,
  <>O <span>amendoim</span> não é um fruto seco, mas sim <span>uma leguminosa</span>.</>,
  <>O <span>canela</span> vem da <span>casca interna de árvores</span>!</>,
  <>O <span>abacaxi</span> continua <span>madurando mesmo depois de colhido</span>.</>,
  <>O <span>uva passa</span> é apenas uma <span>uva desidratada</span>.</>,
  <>O <span>café</span> foi descoberto por <span>pastores que notaram vacas animadas</span> após comerem os grãos.</>,
  <>O <span>pimentão</span> verde é apenas <span>um pimentão imaturo</span>.</>,
  <>O <span>banana</span> é tecnicamente uma <span>herbácea gigante</span>, não uma árvore.</>,
  <>O <span>cenoura</span> era originalmente <span>roxa ou branca</span>, só depois foi criada a laranja.</>,
];

const Loading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [texto, setTexto] = useState(null);

  useEffect(() => {
    // Sorteia um texto
    const randomIndex = Math.floor(Math.random() * textos.length);
    setTexto(textos[randomIndex]);

    const duration = 2000; // 2 segundos
    const start = performance.now();

    // Função de easing: começa devagar, acelera no meio, desacelera no final
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (time) => {
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(t) * 100;
      setProgress(easedProgress);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setFadeOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500); // fade-out de 0.5s
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <div className={`loading-container ${fadeOut ? "fade-out" : "fade-in"}`}>
      <div className="loading-content">
        <img src={LoadingImg} alt="Logo" className="loading-image" />
        <div className="loading-bar-background">
          <div
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="loading-text">{texto}</p>
      </div>
    </div>
  );
};

export default Loading;
