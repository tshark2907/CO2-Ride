from shapely.geometry import LineString, Point
import polyline

def decode_polyline(polyline_str):
    """
    Decodes a polyline string into a list of coordinates (lat, lng).
    """
    return polyline.decode(polyline_str)

def find_intersection(polyline1, polyline2, tolerance=0.001):
    # Decodificar as polylines
    coords1 = polyline.decode(polyline1)
    coords2 = polyline.decode(polyline2)
    
    # Encontrar a interseção com base na tolerância
    intersection = []
    for coord1 in coords1:
        for coord2 in coords2:
            if abs(coord1[0] - coord2[0]) <= tolerance and abs(coord1[1] - coord2[1]) <= tolerance:
                intersection.append(coord1)
                break  # Evita duplicar pontos da interseção
    
    if not intersection:
        print("No intersection found.")
        return None, None, None
    
    # Recodificar a polyline da interseção
    intersection_polyline = polyline.encode(intersection)
    
    # Coordenadas de início e fim da interseção
    start_intersection = intersection[0]
    end_intersection = intersection[-1]
    
    return intersection_polyline, start_intersection, end_intersection

if __name__ == "__main__":
    # Example polylines (replace with actual polylines)
    polyline1 = r"xh|xBfvekGw@Oc@Em@Ds@PWLo@b@[h@Ut@@X`@~Ap@jBPb@X\\PdCl@BNOL]BsCw@{C}@aCu@USQUEOAO@WHQLMVGV?RFHHHNFV@ZYdAENI\YdAWRSFWASMOWAWBUJORK\Ez@XNDlA\bE|A`EhArDbApAPr@JHAFCnA`@nO|D~Bt@hDtAdBz@pAt@hEhDpGrF~B|B|@v@dCxBnEzDjHjG~CpChCzB|AtAxBjBXVrB|Af@\l@Z@HRR`B`Ax@f@xDtBn@`@Z\HT@TGb@KLc@PqBj@sA`@aDjAcB|@gAhAo@dAUf@Uv@Or@GhA@fCPzD`@jMJxEC`AOnA_@vAg@bAm@x@gAx@iFrCoAbA_@b@Yf@Wh@yCnHwDjKkB~EgCvGwCpHkCxG]v@[d@MNw@v@_Aj@u@Zu@VcBd@gATqAb@w@ZiA^aAb@cAn@kAjAUd@Ob@_@hAw@xB}@rDa@hAa@bAOVo@z@[Vu@d@_A\y@ReCd@cCXyBf@qB\_Bh@sDbCuC`BmBfAq@f@sBvAw@r@k@f@kAhA_AdAe@l@aAxAgFlHqFzHm@x@qAtA}AtAiD|BwBjAmD`BaIrDuE|B_DdByAr@eJrEmBx@gBl@c@NmAf@kAj@kAr@kAjAm@x@sA~BuBpEk@fAi@n@cA~@_G~D_BdA_A`@a@HgAL_@?g@EmGo@_BK}BOmAEcCIWUmAOSGQKEIGU?M@SHOfCuBXQPC|@?fAdBRb@l@|Ad@nA~CjI`FtNzG~QBXhAlD~AlEpAbDPd@CDCDCFGZ?FWTgEhBiCfAiIdDg@TQPOd@Cb@SnHaCGC?A\C\wBGBSDm@"
    polyline2 = r"`o_yBrljkGPA@JJxEC`AOnA_@vAg@bAm@x@gAx@iFrCoAbA_@b@Yf@Wh@yCnHwDjKkB~EgCvGwCpHkCxG]v@[d@MNw@v@_Aj@u@Zu@VcBd@gATqAb@w@ZiA^aAb@cAn@kAjAUd@Ob@_@hAw@xB}@rDa@hAa@bAOVo@z@[Vu@d@_A\y@ReCd@cCXyBf@qB\_Bh@sDbCuC`BmBfAq@f@sBvAw@r@k@f@kAhA_AdAe@l@oDfFyB~CqFzHm@x@qAtA}AtAiD|BwBjAmD`BkLpFkB~@_DdByAr@eJrEmBx@gBl@c@NmAf@kAj@kAr@kAjAm@x@sA~BuBpEk@fAi@n@cA~@_G~D_BdA_A`@a@HgAL_@?g@EmGo@}CSmCMcCIWUmAOSGQKEIGU?M@SHOfCuBXQPC|@?fAdBRb@l@|Ad@nAZx@bCpG`FtNzG~QBXhAlD~AlEpAbDPd@CDCDCFGZ?FWTgEhBkHxCgDrAg@TQPOd@Cb@SnHaCGC?A\C\wBGBSDm@"

    # Compare the polylines
    result = find_intersection(polyline1, polyline2, tolerance=0.001)
    print(result)
