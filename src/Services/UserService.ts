import { User } from "../types/types";
import { axiosInstance } from "./AxiosInstance";

export class UserService {
  public static async getAll() {
    return (await axiosInstance.get<User[]>("/user")).data;
  }

  public static async getAllWithRoles() {
    return (await axiosInstance.get<User[]>("/user/role")).data;
  }

  public static async updateRole(userId: number, roleId: number) {
    await axiosInstance.put(`/user/updateRole`, { userId, roleId });
  }
}
