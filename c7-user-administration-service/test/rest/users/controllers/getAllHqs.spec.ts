import getAllHqs from "@/server/v1/rest/users/controllers/getAllHqs";
import { getHqLocations } from "@/server/v1/locations/location.service.utils";

jest.mock("@/server/v1/locations/location.service.utils", () => ({
  getHqLocations: jest.fn(() => Promise.resolve({}))
}));

describe("get all HQs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls getHqLocations location service util function", async () => {
    await getAllHqs();

    expect(getHqLocations).toHaveBeenCalledTimes(1);
  });

  it("maps to LocationData[]", async () => {
    const hqResponse1 = { accounts: [{ accountName: "Account 1234567", sapAccountId: "0001234567" }] };
    ((getHqLocations as unknown) as any).mockImplementation(() =>
      Promise.resolve(hqResponse1)
    );
    const result = await getAllHqs();

    expect(getHqLocations).toHaveBeenCalledTimes(1);

    expect(result[0].name).toEqual(hqResponse1.accounts[0].accountName);
    expect(result[0].id).toEqual(hqResponse1.accounts[0].sapAccountId);
  });
});
