import { CldImage } from 'next-cloudinary';

function formatWhatsAppText(text) {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<s>$1</s>')
    .replace(/\n/g, '<br>');
}

export default function WapDetails({ wap }) {
  return (
    <>
      <div className="prose max-w-none w-3/5" dangerouslySetInnerHTML={{ __html: formatWhatsAppText(wap.rawText) }} />
      <div className="flex flex-wrap gap-4 content-start w-2/5">
        {wap.images.map((url, i) => (
          <div key={i} className="w-30 h-40">
            <CldImage src={url} alt="img" width={50} height={100} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}
