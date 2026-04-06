import './style.css'

//en type för att man bara ska kunna välja a, b, c. Osäker om det behövs här, då en select används men bra träning kanske?
//Detta säger att typen Progression kan vara antingen A, B eller C
type Progression = "A" | "B" | "C";

//Interface: mall för hur objektet Course ska se ut. Progression annorlunda, då den använder type från tidigare
interface Course{
  code: string;
  courseName: string;
  progression: Progression;
  syllabus:string;
}

//en tom array att spara framtida kurser inuti
let courses: Course[] = [];

//hämta alla input och knapp
const codeInput = document.getElementById("course-code") as HTMLInputElement;
const courseNameInput = document.getElementById("course-name") as HTMLInputElement;
const progressionSelect = document.getElementById("progression") as HTMLSelectElement;
const syllabusInput = document.getElementById("syllabus") as HTMLInputElement;
const addBtn = document.getElementById("add-course") as HTMLButtonElement;
const courseTable = document.getElementById("course-table") as HTMLTableSectionElement;

//lyssna efter klick. Validering innan input/data hamnar i array. Pga form i html behövs en preventDefault()
addBtn.addEventListener("click", (event) => {
  event.preventDefault();

  //trimma input värden och validera. Progression har ingen trim: är en select från html så bara value
  const code: string = codeInput.value.trim();
  const courseName : string = courseNameInput.value.trim();
  const progression: string = progressionSelect.value;
  const syllabus: string = syllabusInput.value.trim();

  //validering av input. Alla fält måste vara ifyllda: progression måste vara A, B eller C.
  if(code === "" ||courseName === "" ||syllabus === ""){
      alert("Alla fält måste fyllas i!");
      return;
    }
  //validering för progression: om varken a, b eller c är vald, skicka en alert.
  if(progression !== "A" && progression !== "B" && progression !== "C"){
    alert("Välj progression A, B eller C!");
    return;
  }

  //kurskoden måste vara unik. some() kontrollerar om det finns en kurs med samma kod i arrayen (sparade kurser)
  if(courses.some((course: Course) => course.code === code)){
    alert("Den här kurskoden finns redan! Vänligen använd en unik kod!");
    return;
  }

  //om all validering är ok: skapa nytt kursobjekt, lägg till i array. Renderar om tabellen så den visar alla kurser
  const newCourse: Course = {
    code: code,
    courseName: courseName,
    progression: progression,
    syllabus: syllabus
  };
  courses.push(newCourse);
  renderCourses();

  //töm input efter inmatning 
  codeInput.value="";
  courseNameInput.value="";
  progressionSelect.value="";
  syllabusInput.value="";
});

//function som skapar en tabellrad för varje kurs. Börja med att ha tom tabell. 
// Returvärde = void pga att vi inte hämtar ngt värde: vi uppdaterar en tabell
function renderCourses(): void {
  courseTable.innerHTML = "";

  /*loopa igenom kurser, skapa tabellrader för varje "del" av kursen
  För varje objekt i arrayen courses - varje objekt följer interface Course - skapa tabellrad med kursinformation*/
  courses.forEach((course: Course) => {
    const row: HTMLTableRowElement = document.createElement("tr");
    const codeCell: HTMLTableCellElement = document.createElement("td");
    const nameCell: HTMLTableCellElement = document.createElement("td");
    const progressionCell: HTMLTableCellElement = document.createElement("td");
    const syllabusCell: HTMLTableCellElement = document.createElement("td");
    const delCell: HTMLTableCellElement = document.createElement("td");

    codeCell.textContent = course.code;
    nameCell.textContent = course.courseName;
    progressionCell.textContent = course.progression;
    syllabusCell.innerHTML = "<a href='" + course.syllabus + "' target='_blank'>" + course.syllabus + "</a>";

    /*delete knapp: skapar knapp och lägger till klick-lyssnare.
    När knapp klickas: kurs filtreras bort från arrayen, baseras på kurskoden (code)
    Tabellen renderas om med uppdaterad lista*/
    const delBtn: HTMLButtonElement = document.createElement("button");
    delBtn.textContent = "Ta bort";
    delBtn.classList.add("deleteBtn");
    delCell.classList.add("delete-column");
    delBtn.addEventListener("click", (): void => {
      courses = courses.filter((c: Course) => c.code !== course.code);
      renderCourses();
    })

    //pusha allt som ska finnas med i tabell-raderna: delCell ska ha knapp för att radera, sedan append allt till rader
    delCell.appendChild(delBtn);

    row.appendChild(codeCell);
    row.appendChild(nameCell);
    row.appendChild(progressionCell);
    row.appendChild(syllabusCell);
    row.appendChild(delCell);

    courseTable.appendChild(row);
  })
  //kalla på saveCourses efter varje rendering. Sparar lista i localStorage
  saveCourses();
}

//localstorage
/* localStorage kan bara spara strängar (text). JSON.stringify() används för att konvertera
objekt eller array till JSON-sträng när data ska sparas.
*/
function saveCourses(): void {
  localStorage.setItem("courses", JSON.stringify(courses));
}

/*Om det finns några sparade kurser, så hämtas och visas de i tabellen. 
JSON.parse() används för att konvertera JSON-sträng tillbaka till JS-objekt/array.
Funktionen renderCourses() kallas för att visa de hämtade kurserna i tabellen.
*/
const saved = localStorage.getItem("courses");
if(saved){
  courses = JSON.parse(saved);
  renderCourses();
}