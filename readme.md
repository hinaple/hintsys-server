# ROOM ESCAPE HINT SYSTEM - **SERVER**

> ⚠️ Please note that this project contains only the serverside system. **The client code is not opened in the public.**

> Anyone can freely use the code for this project. It is completely acceptable to fork the repository, or modify the code. However, I **absolutely** prohibit the use of this project for commercial purposes, regardless of whether the code is modified or not.
>
> For example, the examples below allow.
>
> -   ✅ Using this project for free to provide the system to stores
> -   ✅ Using the system using this project in your store
>
> On the other hand, the following cases are **absolutely** prohibited.
>
> -   🚫 Selling the system using this project at a financial price
> -   🚫 Transforming this project into a commercial form of SaaS
>
> I will impose strong legal sanctions if caught in a prohibited case. I ask you kindly to respect intellectual property rights.
>
> Of course, it's okay to ask me about use in any case, including any prohibited cases.
> Please contact me by email: fainthit@kakao.com
>
> And please feel free to create a PR on this project! Thanks. 🤗
>
> (PS: I won't sell any permission monetarily to use this code.)

## Project Informations

| Current Version |
| --------------- |
| 0.0.0           |

## Database Diagram

> You can access to the database dump at `/mysql/dumps/`

![DataBase Diagram](DBstructure.png)

## Tech Stack

| framework  | Socket    | Database |
| ---------- | --------- | -------- |
| Express.js | Socket.io | MySQL    |

---

## Document

### Objects

<details>
<summary>
<code><b>Theme</b></code>
<code>(Theme preview info)</code>
</summary>

##### Theme

> | key         | description                                | type   | default  |
> | ----------- | ------------------------------------------ | ------ | -------- |
> | idx         | The identified number of the theme         | Int    |          |
> | name        | The name or the title of the theme         | String |          |
> | time_limit  | The theme's limit time in minutes          | Int    | `60`     |
> | icon        | The theme's icon image URL                 | String |          |
> | theme_color | The CSS color code of the theme main color | String | `'#000'` |
> | createdAt   | When the theme has been created            | Date   |          |
> | updatedAt   | When the theme has been updated at last    | Date   |          |

</details>

<details>
<summary>
<code><b>Play_info</b></code>
<code>(Each playing simple information)</code>
</summary>

##### Play_info

> | key         | description                                                      | type | default |
> | ----------- | ---------------------------------------------------------------- | ---- | ------- |
> | idx         | The identified number of the playing info                        | Int  |         |
> | theme_idx   | The linked theme idx                                             | Int  |         |
> | status      | Theme playing status                                             | Int  | `0`     |
> | startedAt   | The exact time of the start playing. `Null` when `status` is `0` | Date |         |
> | pausedAt    | The exact time of the last pausing.                              | Date |         |
> | add_sec     | Seconds will be added to the total playing time.                 | Int  |         |
> | device_info | The socket id of the connected hint device.                      | Int  |         |
> | createdAt   | When the data has been created                                   | Date |         |
> | updatedAt   | When the data has been updated at last                           | Date |         |

##### Playing status

> | Value | meaning                                    |
> | ----- | ------------------------------------------ |
> | `0`   | Ready                                      |
> | `1`   | Playing                                    |
> | `2`   | Paused                                     |
> | `-1`  | Ended                                      |
> | `-2`  | Disconnected(Not sure if it would be used) |

</details>

<details>
<summary>
<code><b>Player_info</b></code>
<code>(Detailed player information)</code>
</summary>

##### Player_info

> | key  | description                        | type   | default |
> | ---- | ---------------------------------- | ------ | ------- |
> | name | The name of the player             | String |         |
> | tel  | The Telephone number of the player | String |         |

</details>

<details>
<summary>
<code><b>Hint</b></code>
<code>(A single hint information including contents)</code>
</summary>

##### Hint

> | key      | description                                                        | type   | default |
> | -------- | ------------------------------------------------------------------ | ------ | ------- |
> | idx      | The identified number of the hint                                  | Int    |         |
> | code     | Hint code                                                          | String |         |
> | progress | Progress of the hint for the whole theme (%)                       | Float  |         |
> | contents | Each element contains `idx(Int)`, `contents(String)`, `step(Int)`. | Array  |         |

</details>

<details>
<summary>
<code><b>Account</b></code>
<code>(An authentication account information)</code>
</summary>

##### Account

> | key       | description                                       | type        | default |
> | --------- | ------------------------------------------------- | ----------- | ------- |
> | idx       | Identified number of the account                  | Int         |         |
> | id        | Account ID                                        | String      |         |
> | password  | Account password                                  | String      |         |
> | alias     | Account alias (of course can be used as nickname) | String      |         |
> | level     | Security level                                    | Int         | 0       |
> | data      | Additional data                                   | JSON String |         |
> | createdAt | When the account has been created                 | Date        |         |
> | updatedAt | When the account has been updated at last         | Date        |         |

##### Security Level Indicator

> 'Allowed' informations are stored in `data` column.

> | level | account type              | accessable area                                                                                |
> | ----- | ------------------------- | ---------------------------------------------------------------------------------------------- |
> | 0     | Default Account           | N/A                                                                                            |
> | 1     | Low-Ranked Hint Device    | **readonly**: Allowed theme and hint informations                                              |
> | 2     | High-Ranked Hint Device   | **readonly**: Every themes and hints inforations                                               |
> | 3     | Low-Ranked Center Device  | Managing play info related to allowed themss and hints, **readonly**: Allowed themes and hints |
> | 4     | High-Ranked Center Device | Manaing every play infos, **readonly**: Every themes and hints                                 |
> | 5     | Low-Ranked Administrator  | Managing informations only related to allowed themes                                           |
> | 6     | High-Ranked Administrator | Managing every informations                                                                    |
> | 9     | Master                    | Able to access and edit every data except accounts ranked the same                             |
> | 99    | Root                      | God                                                                                            |

##### `data` column form

```json
{
    "allowed": [ {theme_idx1}, {theme_idx2}, ... ]
}
```

</details>

<details>
<summary>
<code><b>Setting</b></code>
<code>(A single Configuration)</code>
</summary>

> This table is free to use depending on how the clients work.

##### Setting

> | key   | description  | type   | default |
> | ----- | ------------ | ------ | ------- |
> | label | config label | String |         |
> | value | config value | String |         |

##### Configurations List

> | label | description | default value |
> | ----- | ----------- | ------------- |
> |       |             |               |

</details>

### Endpoints

> Every restful endpoints are start with **`http(s)://{HOST}/api`**.

#### Theme

<details>

<summary>
<code>POST</code>
<code><b>/theme</b></code>
<code>(Create a new theme info with title)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 6 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Body

> | name | required | data type | description                             |
> | ---- | -------- | --------- | --------------------------------------- |
> | name | Y        | String    | The theme title (default `"New Theme"`) |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Created Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>GET</code>
<code><b>/theme/list</b></code>
<code>(Get list of the themes)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 1 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `200`     | `application/json` | Array of [Theme](#Theme)                   |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>PATCH</code>
<code><b>/theme/{idx}</b></code>
<code>(Update theme information except hint)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 5 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name | data type | description      |
> | ---- | --------- | ---------------- |
> | idx  | Int       | Target theme idx |

##### Body

> | name       | required | data type | description                                      |
> | ---------- | -------- | --------- | ------------------------------------------------ |
> | updateData | Y        | Object    | `{"{updatingValueKey}": "{valueToUpdate}", ...}` |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Patched Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>GET</code>
<code><b>/theme/{idx}</b></code>
<code>(Get full informations of the theme)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 1 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name | data type | description      |
> | ---- | --------- | ---------------- |
> | idx  | Int       | Target theme idx |

##### Responses

> | http code | content-type       | response                                             |
> | --------- | ------------------ | ---------------------------------------------------- |
> | `200`     | `application/json` | [Theme](#Theme) but contains Array of [Hint](#Hint)s |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`              |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}`           |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`             |

</details>

#### Hint

<details>

<summary>
<code>POST</code>
<code><b>/hint/{theme-idx}</b></code>
<code>(Create new hint)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 5 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name      | data type | description      |
> | --------- | --------- | ---------------- |
> | theme-idx | Int       | Target theme idx |

##### Body

> | name     | required | data type | description                                           |
> | -------- | -------- | --------- | ----------------------------------------------------- |
> | code     | Y        | String    | Hintcode, the length must be shorter than 10          |
> | progress | N        | Float     | Theme progress                                        |
> | order    | N        | Int       | The order of the hint. The default order is the last. |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Created Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>PATCH</code>
<code><b>/hint/{hint-idx}</b></code>
<code>(Update the hint information except content)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 5 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name     | data type | description     |
> | -------- | --------- | --------------- |
> | hint-idx | Int       | Target hint idx |

##### Body

> | name       | required | data type | description                                      |
> | ---------- | -------- | --------- | ------------------------------------------------ |
> | updateData | Y        | Object    | `{"{updatingValueKey}": "{valueToUpdate}", ...}` |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Patched Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>POST</code>
<code><b>/hint/{hint-idx}/content</b></code>
<code>(Create new hint content)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 5 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name     | data type | description     |
> | -------- | --------- | --------------- |
> | hint-idx | Int       | Target hint idx |

##### Body

> | name     | required | data type | description                                 |
> | -------- | -------- | --------- | ------------------------------------------- |
> | contents | N        | String    | The hint content. Using common HTML syntax. |
> | step     | N        | Int       | The hint step.                              |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Created Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>PATCH</code>
<code><b>/hint/{content-idx}/content</b></code>
<code>(Update the hint content)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 5 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name        | data type | description        |
> | ----------- | --------- | ------------------ |
> | content-idx | Int       | Target content idx |

##### Body

> | name     | required | data type | description                                 |
> | -------- | -------- | --------- | ------------------------------------------- |
> | contents | N        | String    | The hint content. Using common HTML syntax. |
> | step     | N        | Int       | The hint step. The default step is `1`.     |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Patched Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

#### Play Information

<details>

<summary>
<code>POST</code>
<code><b>/playinfo/{theme-idx}</b></code>
<code>(Create new play info with REST API)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 3 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name      | data type | description      |
> | --------- | --------- | ---------------- |
> | theme-idx | Int       | Target theme idx |

##### Body

> | name     | required | data type | description                                              |
> | -------- | -------- | --------- | -------------------------------------------------------- |
> | status   | N        | Int       | The default value is `0`.                                |
> | staredAt | N        | Date      | The default value is current time.                       |
> | add_sec  | N        | int       | The added seconds to playtime. The default value is `0`. |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Created Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>GET</code>
<code><b>/playinfo/{theme-idx}/list</b></code>
<code>(Get available playing info list)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 3 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name      | data type | description      |
> | --------- | --------- | ---------------- |
> | theme-idx | Int       | Target theme idx |

##### URI Query

> | name   | required | data type | description                                      |
> | ------ | -------- | --------- | ------------------------------------------------ |
> | status | N        | Int       | Get results only have the same `status` value    |
> | theme  | N        | Int       | Get results only have the same `theme_idx` value |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `200`     | `application/json` | Array of [Play_info](#Play_info)           |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>PATCH</code>
<code><b>/playinfo/{info-idx}</b></code>
<code>(Update play info with REST API)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 3 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name     | data type | description     |
> | -------- | --------- | --------------- |
> | info-idx | Int       | Target info idx |

##### Body

> | name       | required | data type | description                                      |
> | ---------- | -------- | --------- | ------------------------------------------------ |
> | updateData | Y        | Object    | `{"{updatingValueKey}": "{valueToUpdate}", ...}` |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Patched Successfully"}`      |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>PATCH</code>
<code><b>/playinfo/{info-idx}/addTime</b></code>
<code>(Add seconds on playtime)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 3 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name     | data type | description     |
> | -------- | --------- | --------------- |
> | info-idx | Int       | Target info idx |

##### Body

> | name    | required | data type | description                            |
> | ------- | -------- | --------- | -------------------------------------- |
> | add_sec | Y        | Int       | Of course it can be a negative number. |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `201`     | `application/json` | `{"message": "Added Successfully"}`        |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

<details>

<summary>
<code>GET</code>
<code><b>/playinfo/{info-idx}/players</b></code>
<code>(Get players information related to a specific play information)</code>
</summary>

##### Headers

> | name             | required | data type | description                |
> | ---------------- | -------- | --------- | -------------------------- |
> | Authorization-id | Y        | String    | Requires level 5 or higher |
> | Authorization-pw | Y        | String    |                            |

##### Parameters

> | name     | data type | description     |
> | -------- | --------- | --------------- |
> | info-idx | Int       | Target info idx |

##### Responses

> | http code | content-type       | response                                   |
> | --------- | ------------------ | ------------------------------------------ |
> | `200`     | `application/json` | Array of [Player_info](#Player_info)       |
> | `401`     | `application/json` | `{"code":401,"message":"Unauthorized"}`    |
> | `403`     | `application/json` | `{"code":403,"message":"Low Security Lv"}` |
> | `500`     | `application/json` | `{"code":500,"message":"Unknown Error"}`   |

</details>

#### Account

<details>

<summary>
<code>GET</code>
<code><b>/account/login </b></code>
<code>()</code>
</summary>

##### Headers

> | name          | required | data type | description |
> | ------------- | -------- | --------- | ----------- |
> | Authorization | Y        | String    |             |

##### Parameters

> | name | required | data type | description |
> | ---- | -------- | --------- | ----------- |
> |      | Y        |           |             |

##### Responses

> | http code | content-type               | response                                |
> | --------- | -------------------------- | --------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` |                                         |
> | `401`     | `application/json`         | `{"code":401,"message":"Unauthorized"}` |

</details>
