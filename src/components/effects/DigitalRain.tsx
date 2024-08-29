import { useEffect } from "react";
import "./digitalRain.css";

export default function DigitalRain() {
    useEffect(() => {
        const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const width = window.innerWidth;
        const height = window.innerHeight;
    
        canvas.width = width;
        canvas.height = height;
    
        const columns = Math.floor(width / 20) + 1;
        const yPositions = Array(columns).fill(0);
    
        const matrix = () => {
          if (!ctx) return;
    
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, width, height);
    
          ctx.fillStyle = 'rgba(0, 255, 204, 0.4)';
          ctx.font = '18px monospace';
    
          yPositions.forEach((y, index) => {
            const text = String.fromCharCode(Math.random() * 128);
            const x = index * 20;
            ctx.fillText(text, x, y);
    
            // Randomize the speed for each column
            if (y > height && Math.random() > 0.975) {
              yPositions[index] = 0;
            } else {
              yPositions[index] = y + Math.random() * 20 + 10;
            }
          });
        };
    
        const interval = setInterval(matrix, 100);
    
        return () => clearInterval(interval);
    }, []);

    return (
        <canvas id="matrix-canvas" className={"matrixRain"}></canvas>
    );
}