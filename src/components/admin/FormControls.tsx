'use client';
export function Input({label, ...rest}:{label?:string} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block mb-3">
      {label && <div className="text-sm mb-1">{label}</div>}
      <input {...rest} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring" />
    </label>
  );
}
export function Textarea({label, ...rest}:{label?:string} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block mb-3">
      {label && <div className="text-sm mb-1">{label}</div>}
      <textarea {...rest} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring min-h-[120px]" />
    </label>
  );
}
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50" />;
}
export function Switch({checked, onChange}:{checked:boolean; onChange:(v:boolean)=>void}) {
  return (
    <button onClick={()=>onChange(!checked)} className={`w-12 h-7 rounded-full ${checked?'bg-green-500':'bg-gray-300'} relative`}>
      <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition ${checked?'translate-x-5':''}`} />
    </button>
  );
}
