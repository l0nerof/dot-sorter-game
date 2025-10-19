function Rules() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-black/20 rounded-xl border border-white/10">
      <h3 className="text-xl font-bold text-cyan-400">Як грати:</h3>

      <ul className="flex flex-col gap-2 list-disc list-inside">
        <li>Рухай мишкою — точки тікають від курсора</li>
        <li>Збери точки в групи за кольорами</li>
        <li>Будь швидким — час йде!</li>
      </ul>
    </div>
  );
}

export default Rules;
