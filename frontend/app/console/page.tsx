import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, columns } from "./components/membersTable/columns";
import { DataTable } from "./components/membersTable/data-table";

async function getData(): Promise<Circle[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      circle: "Circle Alpha",
      owner: "Alice",
      volume: 50,
      created: new Date("2023-01-15"),
      cycles: 5,
      status: "active",
    },
    {
      id: 2,
      circle: "Circle Beta",
      owner: "Bob",
      volume: 30,
      created: new Date("2023-03-20"),
      cycles: 3,
      status: "ended",
    },
    {
      id: 3,
      circle: "Circle Gamma",
      owner: "Charlie",
      volume: 80,
      created: new Date("2023-07-12"),
      cycles: 8,
      status: "active",
    },
    {
      id: 4,
      circle: "Circle Delta",
      owner: "Diana",
      volume: 20,
      created: new Date("2023-11-05"),
      cycles: 2,
      status: "ended",
    },
    {
      id: 5,
      circle: "Circle Epsilon",
      owner: "Eve",
      volume: 100,
      created: new Date("2023-09-01"),
      cycles: 10,
      status: "active",
    },
    {
      id: 6,
      circle: "Circle Zeta",
      owner: "Frank",
      volume: 40,
      created: new Date("2023-05-22"),
      cycles: 4,
      status: "ended",
    },
    {
      id: 7,
      circle: "Circle Eta",
      owner: "Grace",
      volume: 60,
      created: new Date("2023-02-18"),
      cycles: 6,
      status: "active",
    },
    {
      id: 8,
      circle: "Circle Theta",
      owner: "Hannah",
      volume: 70,
      created: new Date("2023-04-10"),
      cycles: 7,
      status: "ended",
    },
    {
      id: 9,
      circle: "Circle Iota",
      owner: "Ian",
      volume: 30,
      created: new Date("2023-06-30"),
      cycles: 3,
      status: "active",
    },
    {
      id: 10,
      circle: "Circle Kappa",
      owner: "Jack",
      volume: 90,
      created: new Date("2023-08-14"),
      cycles: 9,
      status: "ended",
    },
    {
      id: 11,
      circle: "Circle Lambda",
      owner: "Karen",
      volume: 50,
      created: new Date("2023-10-03"),
      cycles: 5,
      status: "active",
    },
    {
      id: 12,
      circle: "Circle Mu",
      owner: "Leo",
      volume: 110,
      created: new Date("2023-12-09"),
      cycles: 11,
      status: "ended",
    },
    {
      id: 13,
      circle: "Circle Nu",
      owner: "Mia",
      volume: 20,
      created: new Date("2023-01-25"),
      cycles: 2,
      status: "active",
    },
    {
      id: 14,
      circle: "Circle Xi",
      owner: "Nina",
      volume: 80,
      created: new Date("2023-03-14"),
      cycles: 8,
      status: "ended",
    },
    {
      id: 15,
      circle: "Circle Omicron",
      owner: "Oscar",
      volume: 100,
      created: new Date("2023-05-01"),
      cycles: 10,
      status: "active",
    },
    {
      id: 16,
      circle: "Circle Pi",
      owner: "Paul",
      volume: 10,
      created: new Date("2023-07-19"),
      cycles: 1,
      status: "ended",
    },
    {
      id: 17,
      circle: "Circle Rho",
      owner: "Quinn",
      volume: 40,
      created: new Date("2023-09-28"),
      cycles: 4,
      status: "active",
    },
    {
      id: 18,
      circle: "Circle Sigma",
      owner: "Rachel",
      volume: 60,
      created: new Date("2023-11-11"),
      cycles: 6,
      status: "ended",
    },
    {
      id: 19,
      circle: "Circle Tau",
      owner: "Sam",
      volume: 70,
      created: new Date("2023-02-02"),
      cycles: 7,
      status: "active",
    },
    {
      id: 20,
      circle: "Circle Upsilon",
      owner: "Tina",
      volume: 120,
      created: new Date("2023-04-23"),
      cycles: 12,
      status: "ended",
    },
  ];
}

export default async function Console() {
  const data = await getData();

  return (
    <main className="h-full flex flex-col overflow-y-auto   ">
      {/* summary  */}
      <section className="grid xl:h-[18%]  gap-4 md:grid-cols-2 lg:grid-cols-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Transactions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              Accumulated transactions.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Circles
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              Total circles created.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Users
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+125</div>
            <p className="text-xs text-muted-foreground">
              Total registered users.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Active Cycle
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Days</div>
            <p className="text-xs text-muted-foreground">To end 25 Dec 2025</p>
          </CardContent>
        </Card>
      </section>
      {/* additional data */}
      {/* <section className="h-[100vh] xl:h-[82%] flex  gap-10 px-3 w-full overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </section> */}

      <section className="h-auto xl:h-[82%]   flex flex-col xl:flex-row gap-10">
        <DataTable columns={columns} data={data} />
      </section>
    </main>
  );
}
