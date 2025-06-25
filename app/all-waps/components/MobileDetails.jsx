import { CldImage } from 'next-cloudinary';

function formatWhatsAppText(text) {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<s>$1</s>')
    .replace(/\n/g, '<br>');
}

export default function MobileDetails({ wap, back }) {
  return (
    <div className="p-4">
      <button onClick={back} className="mb-4 text-blue-600 font-semibold">← Back</button>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formatWhatsAppText(wap.rawText) }} />
      <div className="flex flex-wrap gap-2 mt-4">
        {wap.images.map((url, i) => (
          <div key={i} className="w-24 h-32">
            <CldImage src={url} alt="img" width={50} height={100} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
